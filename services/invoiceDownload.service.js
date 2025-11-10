/**
 * @fileoverview Servicio principal para la descarga y procesamiento de facturas
 * Maneja el flujo completo: autenticación, descarga de PDFs, extracción de XMLs y subida a Azure
 */

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const auth = require('../middlewares/auth.middleware');
const fileUtils = require('../utils/fileManager.utils');
const Gomedisys = require('../models/Gomedisys.model');
const AzureStorage = require('../models/AzureStorage.model');
const ZentriaAPI = require('../models/ZentriaAPI.model');
const { getConnectionParamsByIpsName } = require('../utils/connectionParams.utils');

/**
 * Procesa y descarga facturas completas con PDFs y XMLs
 * @async
 * @function download
 * @param {Object} params - Parámetros de descarga
 * @param {Array} params.invoices - Array de objetos con información de facturas
 * @param {string} params.invoices[].numero_factura - Número de factura
 * @param {string} params.invoices[].nombre_ips - Nombre completo de la IPS
 * @returns {Promise<Object>} Resultado del procesamiento con status y mensaje
 * @description Ejecuta el flujo completo:
 * 1. Autenticación por nombre de IPS
 * 2. Descarga PDFs (producto + detallado) y los combina
 * 3. Extrae ID XML y descarga archivo XML desde ZIP
 * 4. Sube PDF y XML a Azure Storage
 * 5. Envía PDF a ETL de Zentria
 * @example
 * await download({ 
 *   invoices: [
 *     { numero_factura: "ACI-1305101", nombre_ips: "Clínica Avidanti Ibagué" },
 *     { numero_factura: "ACC-193768", nombre_ips: "Sogamoso" }
 *   ]
 * });
 */
const download = async (params) => {

  // se importa el modelo de Azure Storage y Gomedisys
  const azureStorage = new AzureStorage();
  const gomedisys = new Gomedisys();
  const zentriaAPI = new ZentriaAPI();

  let lastIpsName = null;
  let sessionCookie = null;

  // Procesar lista de facturas con estructura completa (numero_factura + nombre_ips)
  const invoiceList = params.invoices;

  for (const invoice of invoiceList) {
    try {
      // Obtener datos de la factura
      const invoiceNumber = invoice.numero_factura;
      const ipsName = invoice.nombre_ips;

      // Crear carpeta temporal para la descarga
      const downloadFolder = `./temp/${invoiceNumber}`;
      fileUtils.createFolder(downloadFolder);

      // Solo pedir cookies si el nombre de IPS cambió
      if (ipsName !== lastIpsName) {
        sessionCookie = await auth.getSessionCookie(ipsName);
        lastIpsName = ipsName;
      }

      if (!sessionCookie) {
        console.warn('No se pudieron actualizar las cookies.');
        throw { status: 500, message: 'No se pudieron actualizar las cookies' };
      }

      console.log('Obteniendo datos de factura con número:', invoiceNumber);

      // Extraer el ID de la factura del número de factura
      const invoiceId = invoiceNumber?.split('-')[1];
      if (!invoiceId) {
        console.error('Error: invoiceNumber no tiene el formato esperado.');
        throw { status: 400, message: 'Número de factura inválido' };
      }

      //console.log('ID de factura extraído:', invoiceId, 'y la cockie de sesión es:', sessionCookie);

      // Obtener datos de la factura
      const invoiceData = await gomedisys.getInvoiceData(invoiceId, sessionCookie);
      if (!invoiceData) {
        console.warn('No se recibió información de la factura.');
        throw { status: 404, message: 'No se encontró información de la factura' };
      }

      // Log para debuggear qué se recibe de la API
      console.log('Datos raw recibidos para factura', invoiceNumber, ':', typeof invoiceData, invoiceData);

      // Se convierte la respuesta a un objeto JSON
      const invoiceDataCleaned = await gomedisys.cleanInvoiceInfo(invoiceData);
      
      // Log para ver qué devuelve cleanInvoiceInfo
      console.log('Datos procesados para factura', invoiceNumber, ':', invoiceDataCleaned.length, 'elementos');

      // Verificar que se obtuvieron datos de factura válidos
      if (!invoiceDataCleaned || invoiceDataCleaned.length === 0) {
        console.warn('No se encontraron datos válidos de la factura después de procesar:', invoiceNumber);
        throw { status: 404, message: 'No se encontraron datos válidos de la factura' };
      }

      // Verificar que el primer elemento tenga idInvoice
      if (!invoiceDataCleaned[0] || !invoiceDataCleaned[0].idInvoice) {
        console.warn('El primer elemento de los datos de factura no tiene idInvoice válido:', invoiceDataCleaned[0]);
        throw { status: 404, message: 'Datos de factura incompletos - falta idInvoice' };
      }

      // Obtener las URLs de descarga en paralelo
      const [invoiceProductUrl, invoiceDetailedUrl] = await Promise.all([
        gomedisys.getUrlInvoiceForProduct(invoiceDataCleaned[0].idInvoice, sessionCookie),
        gomedisys.getUrlInvoiceDetailed(invoiceDataCleaned[0].idInvoice, sessionCookie)
      ]);

      if (!invoiceProductUrl && !invoiceDetailedUrl) {
        throw { status: 404, message: 'No se encontraron archivos de factura para descargar' };
      }

      // Ejecutar descargas en paralelo
      const results = await Promise.allSettled([
        invoiceProductUrl ? gomedisys.downloadPDF(invoiceProductUrl, `${invoiceNumber}_producto.pdf`, downloadFolder) : Promise.resolve('No disponible'),
        invoiceDetailedUrl ? gomedisys.downloadPDF(invoiceDetailedUrl, `${invoiceNumber}_detalle.pdf`, downloadFolder) : Promise.resolve('No disponible')
      ]);

      // Analizar resultados de las descargas
      const downloadErrors = results.filter(res => res.status === 'rejected').map(err => err.reason);

      if (downloadErrors.length > 0) {
        console.error('Errores en la descarga:', downloadErrors);
        return { status: 500, message: 'Hubo errores en la descarga de la factura.', errors: downloadErrors };
      }

      // Se combinan los PDFs descargados
      const mergedPdfPath = await fileUtils.combineInvoices(downloadFolder, invoiceNumber);

      if (mergedPdfPath) {
        console.log('✅ Factura combinada descargada correctamente:', mergedPdfPath);
      } else {
        console.error('❌ Error al combinar los PDFs.');
      }

      // Obtener parámetros de conexión basados en nombre IPS
      const connectionParams = getConnectionParamsByIpsName(ipsName);

      const idXML = await gomedisys.getIdXML(invoiceId, sessionCookie, connectionParams.officeId)

      console.log('ID XML de la factura:', idXML, invoiceId);

      // Descargar y extraer el archivo XML si se obtuvo el ID
      let xmlInfo = null;
      if (idXML) {
        try {
          console.log('Descargando archivo XML para la factura...');
          xmlInfo = await gomedisys.downloadAndExtractXML(idXML, invoiceId, sessionCookie, downloadFolder);
          console.log('✅ Archivo XML descargado y extraído:', xmlInfo.xmlFileName);
        } catch (xmlError) {
          console.error('❌ Error al descargar XML (continuando con el proceso):', xmlError.message);
        }
      } else {
        console.warn('No se pudo obtener el ID XML para la factura');
      }

      console.log('Factura descargada correctamente y combinnada');

      // Subir el PDF combinado a Azure
      await azureStorage.upload(`${invoiceNumber}`, mergedPdfPath)

      // Subir el archivo XML a Azure si se descargó exitosamente
      if (xmlInfo && xmlInfo.xmlFilePath) {
        try {
          // Subir XML en la misma ruta que el PDF (usando el mismo invoiceNumber como directorio)
          await azureStorage.upload(`${invoiceNumber}`, xmlInfo.xmlFilePath);
          console.log('✅ Archivo XML subido a Azure en la misma ruta:', xmlInfo.xmlFileName);
        } catch (xmlUploadError) {
          console.error('❌ Error al subir XML a Azure:', xmlUploadError.message);
        }
      }

      // Subir el PDF a la ETL
      zentriaAPI.uploadPdfEtlV3(mergedPdfPath);
      console.log('Factura subida a la ETL.');

      // Eliminar la carpeta temporal después de la descarga
      setTimeout(async () => {
        fileUtils.deleteFolder(downloadFolder);
      }, 1 * 1000);

    } catch (error) {
      // Eliminar la carpeta temporal después de la descarga
      //await fileUtils.deleteFolder(downloadFolder);
      console.error('Error en el flujo de descarga:', error.message);
      
      //return { status: error.status || 500, message: error.message || 'Error inesperado' };
      continue; // Continuar con la siguiente factura en caso de error
    }
  }

  return { status: 200, message: 'Factura descargada correctamente' };
};

module.exports = { download };
