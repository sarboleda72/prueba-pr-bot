/**
 * @fileoverview Rutas específicas para descarga de facturas
 * Define los endpoints para el procesamiento manual de facturas
 */

const express = require('express');
const { executeDownloads } = require('../controllers/invoiceDownload.controller');
const router = express.Router();

/**
 * Endpoint para descarga manual de facturas
 * @route POST /descarga-factura
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string[]} req.body.invoiceNumbers - Array de números de factura
 * @returns {Object} Resultado del procesamiento
 * @description Procesa una lista de facturas: descarga PDFs, extrae XMLs y los sube a Azure
 * @example
 * POST /descarga-factura
 * {
 *   "invoiceNumbers": ["ACM-1426249", "DIAC-123456"]
 * }
 */
router.post('/descarga-factura', executeDownloads);

module.exports = router;