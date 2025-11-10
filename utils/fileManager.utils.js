/**
 * @fileoverview Utilidades para manejo de archivos y PDFs
 * Proporciona funciones para crear carpetas, combinar PDFs y procesar archivos ZIP
 */

const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const path = require('path');
const AdmZip = require('adm-zip');

/**
 * Crea una carpeta si no existe
 * @function createFolder
 * @param {string} folderPath - Ruta de la carpeta a crear
 * @returns {void}
 * @description Crea una carpeta recursivamente si no existe
 */
const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Carpeta creada en: ${folderPath}`);
  } else {
    console.log('La carpeta ya existe.');
  }
};

/**
 * Elimina una carpeta y todo su contenido
 * @function deleteFolder
 * @param {string} folderPath - Ruta de la carpeta a eliminar
 * @returns {void}
 * @description Elimina recursivamente una carpeta y todos sus archivos
 */
const deleteFolder = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`Carpeta eliminada: ${folderPath}`);
  } else {
    console.log('La carpeta no existe.');
  }
};

/**
 * Combina dos archivos PDF en uno solo
 * @async
 * @function mergePDFs
 * @param {string} pdfPath1 - Ruta del primer PDF
 * @param {string} pdfPath2 - Ruta del segundo PDF
 * @param {string} outputPath - Ruta donde guardar el PDF combinado
 * @returns {Promise<string>} Ruta del archivo PDF combinado
 * @throws {Error} Si falla la combinación de PDFs
 * @description Combina dos PDFs copiando todas las páginas del primero y luego del segundo
 */
const mergePDFs = async (pdfPath1, pdfPath2, outputPath) => {
  try {
    const pdf1Bytes = fs.readFileSync(pdfPath1);
    const pdf2Bytes = fs.readFileSync(pdfPath2);

    const pdf1Doc = await PDFDocument.load(pdf1Bytes);
    const pdf2Doc = await PDFDocument.load(pdf2Bytes);

    const mergedPdf = await PDFDocument.create();

    const copiedPages1 = await mergedPdf.copyPages(pdf1Doc, pdf1Doc.getPageIndices());
    copiedPages1.forEach((page) => mergedPdf.addPage(page));

    const copiedPages2 = await mergedPdf.copyPages(pdf2Doc, pdf2Doc.getPageIndices());
    copiedPages2.forEach((page) => mergedPdf.addPage(page));

    const mergedPdfBytes = await mergedPdf.save();
    fs.writeFileSync(outputPath, mergedPdfBytes);

    console.log(`✅ PDF combinado guardado en: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('❌ Error al combinar los PDFs:', error);
    throw error;
  }
}

/**
 * Combina los PDFs de una factura (detallado + producto)
 * @async
 * @function combineInvoices
 * @param {string} downloadFolder - Carpeta que contiene los PDFs a combinar
 * @param {string} invoiceNumber - Número de factura para nombrar los archivos
 * @returns {Promise<string|null>} Ruta del PDF combinado o null si falla
 * @description Busca los PDFs detallado y por producto, los combina en un solo archivo
 */
const combineInvoices = async (downloadFolder, invoiceNumber) => {
  const pdfDetallado = path.join(downloadFolder, `${invoiceNumber}_detalle.pdf`);
  const pdfProducto = path.join(downloadFolder, `${invoiceNumber}_producto.pdf`);
  const pdfFinal = path.join(downloadFolder, `${invoiceNumber}.pdf`);

  if (fs.existsSync(pdfDetallado) && fs.existsSync(pdfProducto)) {
    return await mergePDFs(pdfDetallado, pdfProducto, pdfFinal);
  } else {
    console.error('❌ No se encontraron ambos PDFs para combinar.');
    return null;
  }
};

/**
 * Procesa un buffer ZIP y extrae el archivo XML
 * @async
 * @function processZipBuffer
 * @param {Buffer} zipData - Buffer con los datos del archivo ZIP
 * @param {string} outputDirectory - Directorio donde guardar el XML extraído
 * @returns {Promise<Object>} Información del archivo XML extraído
 * @returns {Promise<Object>} return.xmlFilePath - Ruta completa del archivo XML
 * @returns {Promise<Object>} return.xmlFileName - Nombre del archivo XML
 * @returns {Promise<Object>} return.originalXmlName - Nombre original en el ZIP
 * @throws {Error} Si no se encuentra XML en el ZIP o falla la extracción
 * @description Extrae el primer archivo XML encontrado en un ZIP y lo guarda con su nombre original
 */
const processZipBuffer = async (zipData, outputDirectory) => {
  try {
    // Crear ZIP desde el buffer
    const zip = new AdmZip(Buffer.from(zipData));
    const zipEntries = zip.getEntries();

    console.log('Archivos en el ZIP:', zipEntries.map(entry => entry.entryName));


    // Buscar archivo XML en el ZIP
    const xmlEntry = zipEntries.find(entry => entry.entryName.toLowerCase().endsWith('.xml'));
    if (!xmlEntry) {
      throw new Error('No se encontró archivo XML en el ZIP descargado');
    }

    console.log(`Archivo XML encontrado: ${xmlEntry.entryName}`);

    // Extraer el contenido del XML como buffer
    const xmlBuffer = xmlEntry.getData();

    // Normalizar el nombre del archivo para evitar problemas de rutas mixtas
    const normalizedEntryName = xmlEntry.entryName.replace(/[\\/]/g, path.sep);
    // Usar solo el nombre del archivo, sin las carpetas internas del ZIP
    const xmlFileName = path.basename(normalizedEntryName);
    const xmlFilePath = path.join(outputDirectory, xmlFileName);

    // Guardar el archivo XML en el directorio especificado
    fs.writeFileSync(xmlFilePath, xmlBuffer);

    console.log(`Archivo XML guardado en: ${xmlFilePath}`);

    return {
      xmlFilePath,
      xmlFileName,
      originalXmlName: xmlEntry.entryName
    };

  } catch (error) {
    console.error('Error al procesar ZIP:', error.message);
    throw error;
  }
};

module.exports = { createFolder, combineInvoices, deleteFolder, processZipBuffer };