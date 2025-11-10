/**
 * @fileoverview Controlador para la descarga de facturas de Gomedisys
 * Maneja las peticiones HTTP para el procesamiento de facturas médicas
 */

const support = require('../services/invoiceDownload.service');
const response = require('../models/Response.models')

/**
 * Ejecuta la descarga y procesamiento de facturas
 * @async
 * @function executeDownloads
 * @param {Object} req - Objeto de petición HTTP
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string[]} req.body.invoiceNumbers - Array de números de factura a procesar
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Promise<void>} Respuesta HTTP con el resultado del procesamiento
 * @description Procesa una lista de números de factura, descarga PDFs, extrae XMLs y los sube a Azure Storage
 * @example
 * // POST /descarga-factura
 * // Body: { "invoiceNumbers": ["ACM-1426249", "DIAC-123456"] }
 */
const executeDownloads = async (req, res) => {
  try {
    const { invoices } = req.body;

    const result = await support.download({ invoices });

    res.status(200).send(response.set(result.status || 200, result.message || 'se descargaron los soportes'));

  } catch (error) {

    res.status(400).send(response.set(error.status || 500, error.message || 'no hubo respuesta del servidor'));
  }
};

module.exports = { executeDownloads };