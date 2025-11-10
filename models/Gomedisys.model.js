/**
 * @fileoverview Modelo para interactuar con el sistema Gomedisys
 * Proporciona métodos para autenticación, descarga de PDFs y extracción de datos XML
 */

require('dotenv').config();
const { InvoiceInfo } = require('./InvoiceInfo.model');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const fileUtils = require('../utils/fileManager.utils');

/**
 * Clase para manejar operaciones con el sistema Gomedisys
 * @class Gomedisys
 * @description Proporciona métodos para interactuar con el portal médico Gomedisys,
 * incluyendo descarga de PDFs, obtención de datos de facturas y extracción de archivos XML
 */
class Gomedisys {
  /**
   * Constructor de la clase Gomedisys
   * @constructor
   * @description Inicializa las URLs y claves API desde variables de entorno
   */
  constructor() {
    this.apiUrl = process.env.ZENTRIA_API_URL;
    this.apiKey = process.env.ZENTRIA_API_KEY;
  }

  
  
  /**
   * Descarga un archivo PDF desde una URL
   * @async
   * @method downloadPDF
   * @param {string} url - URL del archivo PDF a descargar
   * @param {string} fileName - Nombre del archivo a guardar
   * @param {string} filePath - Ruta donde guardar el archivo
   * @returns {Promise<string>} Ruta completa del archivo descargado
   * @throws {Error} Si la descarga falla o el status no es 200
   * @description Descarga un PDF usando arraybuffer y lo guarda en el sistema de archivos local
   */
  async downloadPDF(url, fileName, filePath) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      if (response.status !== 200) {
        throw new Error(`Failed to download PDF. Status: ${response.status}`);
      }

      const fullPath = path.join(filePath, fileName);
      fs.writeFileSync(fullPath, response.data);

      return fullPath;

    } catch (error) {
      console.error(`Error downloading PDF: ${error.message}`);
      throw error;
    }
  };

  /**
   * Obtiene los datos completos de una factura por su ID
   * @async
   * @method getInvoiceData
   * @param {string} invoiceId - ID de la factura a consultar
   * @param {string} sessionCookie - Cookie de sesión para autenticación
   * @returns {Promise<Object>} Datos completos de la factura
   * @throws {Error} Si la consulta falla
   * @description Consulta los datos de una factura específica en el sistema Gomedisys
   */
  async getInvoiceData(invoiceId, sessionCookie) {
    const url = process.env.INVOICE_INFO;

    const today = new Date();
    const formattedDate = `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;

    const params = {
      process: 'INVOICES',
      idEncounter: 0,
      numRegister: invoiceId,
      dateBegin: '2025/01/01',
      dateEnd: formattedDate,
      businessName: '',
      contract: '',
      plan: '',
    };

    const response = await axios.post(url, null, {
      params,
      headers: { Cookie: sessionCookie },
      withCredentials: true,
    });

    return response.data;
  };

  /**
   * Obtiene la URL de descarga de la factura en formato "Por Producto"
   * @async
   * @method getUrlInvoiceForProduct
   * @param {string} idInvoice - ID de la factura
   * @param {string} sessionCookie - Cookie de sesión para autenticación
   * @returns {Promise<string>} URL para descargar el PDF por producto
   * @throws {Error} Si la consulta falla
   * @description Genera la URL para descargar la factura en formato detallado por producto
   */
  async getUrlInvoiceForProduct(idInvoice, sessionCookie) {
    try {
      const response = await axios.get('https://weliiavidanti.gomedisys.com/BillSaleUltimateArea/BillSale/PrintInvoiceU', {
        params: {
          idInvoice: idInvoice,
          typeFormat: '[{"Value":26,"Text":"Gomedisys Por Producto","codeTemplate":"2","idPrintFormat":0,"isForProd":true,"isForPat":true}]',
          classInvoice: 'EVE',
          idTransit: 0,
          idReference: 0,
          dateReference: '',
          numReference: 0,
          descriptionAlternate: '',
          isViewComponents: false,
          isRelPatient: false
        },
        headers: { Cookie: sessionCookie }
      });

      return response.data;
    } catch (error) {
      console.error('Error al obtener la factura por producto:', error);
    }
  }

  async getUrlInvoiceDetailed(idInvoice, sessionCookie) {
    try {
      const response = await axios.get('https://weliiavidanti.gomedisys.com/BillSaleUltimateArea/BillSale/PrintInvoiceU', {
        params: {
          idInvoice: idInvoice,
          typeFormat: '[{"Value":25,"Text":"Gomedisys Detallada","codeTemplate":"1","idPrintFormat":0,"isForProd":true,"isForPat":true}]',
          classInvoice: 'EVE',
          idTransit: 0,
          idReference: 0,
          dateReference: '',
          numReference: 0,
          descriptionAlternate: '',
          isViewComponents: false,
          isRelPatient: false
        },
        headers: { Cookie: sessionCookie }
      });

      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la factura detallada:', error);
    }
  }

  async cleanInvoiceInfo(data) {

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return [];
      }
    }

    if (!Array.isArray(data)) {
      console.warn('Invoice data is not an array. Returning empty array.');
      return [];
    }

    return data.map(item => new InvoiceInfo({
      idInvoice: item?.idInvoice ?? null,
      invoiceNumber: item?.InvoiceNumber ?? null,
      encounterNumber: item?.encounterNumber ?? null,
      patient: item?.patient ?? null,
      documentNumber: item?.documentNumber ?? null,
      responsible: item?.responsible ?? null,
      invoiceDate: item?.invoiceDate ?? null,
      contractNumber: item?.nContract ?? null,
      namePlan: item?.namePlan ?? null,
      invoiceState: item?.invoiceState ?? null,
      countPDF: item?.countPDF ?? null,
    }));
  };

  /**
   * Obtiene el ID XML necesario para la descarga de archivos RIPS
   * @async
   * @method getIdXML
   * @param {string} invoiceId - ID de la factura
   * @param {string} sessionCookie - Cookie de sesión para autenticación
   * @param {string} [officeId='8'] - ID de la oficina (dinámico según prefijo)
   * @returns {Promise<string|null>} ID del XML o null si no se encuentra
   * @throws {Error} Si la consulta falla
   * @description Consulta el sistema RIPS para obtener el ID necesario para descargar el archivo XML
   */
  async getIdXML(invoiceId, sessionCookie, officeId = '8') {
    try {
      const today = new Date();
      const formattedDateBegin = `01/02/2025`;
      const formattedDateEnd = `${(today.getDate()).toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

      const params = {
        process: 'RIPS',
        contrato: '',
        plan: '',
        dateBegin: formattedDateBegin,
        dateEnd: formattedDateEnd,
        state: 'A',
        jsonGenerate: 'false',
        CUV: 'false',
        offices: officeId,
        relation: '',
        invoice: invoiceId,
        numberNote: ''
      };

      const response = await axios.post(
        'https://weliiavidanti.gomedisys.com/BillSaleArea/BillInvoiceControlRIPS/GetDataBillInvoicesControlRIPS',
        null,
        {
          params,
          headers: { Cookie: sessionCookie },
          withCredentials: true,
        }
      );

      // Parsear la respuesta JSON
      let data = response.data;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      // Extraer solo el idInvoice del primer elemento
      if (Array.isArray(data) && data.length > 0) {
        return data[0].idInvoice;
      }

      return null;
    } catch (error) {
      console.error('Error al obtener el ID XML:', error.message);
    }
  }

  /**
   * Descarga un archivo ZIP con datos XML y extrae el XML
   * @async
   * @method downloadAndExtractXML
   * @param {string} ripsId - ID del registro RIPS para descargar
   * @param {string} invoiceId - ID de la factura (para logs)
   * @param {string} sessionCookie - Cookie de sesión para autenticación
   * @param {string} outputDirectory - Directorio donde guardar el XML extraído
   * @returns {Promise<Object>} Información del archivo XML extraído
   * @returns {Promise<Object>} return.xmlFilePath - Ruta completa del archivo XML
   * @returns {Promise<Object>} return.xmlFileName - Nombre del archivo XML
   * @returns {Promise<Object>} return.originalXmlName - Nombre original en el ZIP
   * @throws {Error} Si la descarga o extracción falla
   * @description Descarga un ZIP desde Azure Blob Storage, extrae el archivo XML y lo guarda localmente
   */
  async downloadAndExtractXML(ripsId, invoiceId, sessionCookie, outputDirectory) {
    try {
      console.log(`Descargando ZIP para RIPS ID: ${ripsId}`);

      // Primero hacer la petición sin especificar responseType para ver qué devuelve
      const response = await axios.post(
        'https://weliiavidanti.gomedisys.com/BillSaleArea/BillInvoiceControlRIPS/ExportDataZip',
        null,
        {
          params: {
            ids: ripsId,
            process: 'RIPS'
          },
          headers: { Cookie: sessionCookie },
          withCredentials: true
        }
      );

      if (response.status !== 200) {
        throw new Error(`Error al descargar ZIP. Status: ${response.status}`);
      }

      // Verificar si la respuesta es JSON con la URL del archivo
      if (typeof response.data === 'object' && response.data.Aux) {
        const zipUrl = response.data.Aux;
        console.log('URL del archivo ZIP encontrada:', zipUrl);

        // Descargar el archivo ZIP desde la URL proporcionada
        const zipResponse = await axios.get(zipUrl, {
          responseType: 'arraybuffer',
          headers: { Cookie: sessionCookie }
        });

        return await fileUtils.processZipBuffer(zipResponse.data, outputDirectory);
      }

      // Verificar si la respuesta es JSON (error) en lugar de un archivo
      if (typeof response.data === 'object' && response.data.Message !== undefined) {
        throw new Error(`El servidor devolvió un error: ${response.data.Message || 'Error desconocido'}`);
      }

      // Si llegamos aquí, intentamos tratar la respuesta como texto o URL
      if (typeof response.data === 'string') {
        // Si es una URL o path, intentamos descargar el archivo
        if (response.data.startsWith('http') || response.data.includes('.zip')) {
          console.log('Respuesta parece ser una URL o path:', response.data);

          // Intentar descargar desde la URL/path devuelta
          const zipResponse = await axios.get(response.data, {
            responseType: 'arraybuffer',
            headers: { Cookie: sessionCookie }
          });

          return await fileUtils.processZipBuffer(zipResponse.data, outputDirectory);
        } else {
          throw new Error(`Respuesta inesperada del servidor: ${response.data}`);
        }
      }

      throw new Error('No se pudo procesar la respuesta del servidor');

    } catch (error) {
      console.error('Error al descargar y extraer XML:', error.message);
      throw error;
    }
  }
}

module.exports = Gomedisys;