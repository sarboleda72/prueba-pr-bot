/**
 * @fileoverview Rutas de Facturas
 * @module routes/invoiceRoutes
 * @description Define los endpoints HTTP relacionados con facturas
 */

import express from 'express';
import invoiceController from '../controllers/invoice.controller.js';

const router = express.Router();

/**
 * GET /documentary-record-single-order
 * Obtiene facturas radicadas de proveedores y cuentas de cobro con orden única
 * Criterios:
 * - dependencia: 'Provedor' o 'Cuenta Cobro'
 * - estado: 'Radicada'
 * - orden: diferente de 'Vacio'
 * - multiorden: 'Pendiente' o 'No'
 */
router.get('/documentary-record-single-order', invoiceController.getDocumentaryRecordSingleOrder);

/**
 * GET /documentary-record-multi-order
 * Obtiene facturas radicadas de proveedores y cuentas de cobro con multiorden
 * Criterios:
 * - dependencia: 'Provedor' o 'Cuenta Cobro'
 * - estado: 'RadicadaMultiorden'
 * - multiorden: 'Si'
 */
router.get('/documentary-record-multi-order', invoiceController.getDocumentaryRecordMultiOrder);

/**
 * GET /documentary-record
 * Obtiene todas las facturas (orden única y multiorden) separadas para RPA
 * Retorna ambos tipos de facturas en un solo objeto para facilitar el procesamiento
 */
router.get('/documentary-record', invoiceController.getDocumentaryRecordAll);

/**
 * POST /documentary-record/send-to-rpa
 * TEST: Obtiene facturas y las envía al sistema RPA para procesamiento automático
 * Endpoint de prueba para validar la integración con FastAPI
 */
router.post('/documentary-record/send-to-rpa', invoiceController.sendToRPA);

/**
 * GET /rpa/status
 * Verifica el estado del servicio RPA (FastAPI)
 * Útil para comprobar conectividad antes de enviar datos
 */
router.get('/rpa/status', invoiceController.checkRPAStatus);

/**
 * PUT /update-status-documentary
 * Actualiza el estado de una factura a 'RegistroDocumental'
 * Body:
 * - numeroFactura: Número de la factura (requerido)
 * - nit: NIT del proveedor (requerido)
 * - radicado: Número de radicado (requerido)
 */
router.put('/update-status-documentary', invoiceController.updateInvoiceStatusToDocumentary);

export default router;
