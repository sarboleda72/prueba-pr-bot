/**
 * @fileoverview Controlador de Facturas
 * @module controllers/invoiceController
 * @description Maneja las peticiones HTTP relacionadas con facturas
 */

import invoiceService from '../services/invoice.service.js';
import * as rpaIntegrationService from '../services/rpaIntegration.service.js';

/**
 * Obtiene el registro documental de facturas con orden única
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
export const getDocumentaryRecordSingleOrder = async (req, res) => {
  try {
    const result = await invoiceService.getDocumentaryRecordSingleOrder();

    res.status(200).json({
      status: 'success',
      message: 'Registro documental de orden única obtenido correctamente',
      count: result.count,
      data: result.data
    });
  } catch (error) {
    console.error('Error en getDocumentaryRecordSingleOrder:', error);
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error al obtener el registro documental',
      ...(process.env.NODE_ENV === 'development' && { details: error })
    });
  }
};

/**
 * Obtiene el registro documental de facturas con multiorden
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
export const getDocumentaryRecordMultiOrder = async (req, res) => {
  try {
    const result = await invoiceService.getDocumentaryRecordMultiOrder();

    res.status(200).json({
      status: 'success',
      message: 'Registro documental de multiorden obtenido correctamente',
      count: result.count,
      data: result.data
    });
  } catch (error) {
    console.error('Error en getDocumentaryRecordMultiOrder:', error);
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error al obtener el registro documental',
      ...(process.env.NODE_ENV === 'development' && { details: error })
    });
  }
};

/**
 * Obtiene el registro documental completo (orden única y multiorden separados)
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
export const getDocumentaryRecordAll = async (req, res) => {
  try {
    const result = await invoiceService.getDocumentaryRecordAll();

    res.status(200).json({
      status: 'success',
      message: 'Registro documental completo obtenido correctamente',
      total: result.total,
      singleOrder: result.singleOrder,
      multiOrder: result.multiOrder
    });
  } catch (error) {
    console.error('Error en getDocumentaryRecordAll:', error);
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error al obtener el registro documental',
      ...(process.env.NODE_ENV === 'development' && { details: error })
    });
  }
};

/**
 * TEST: Obtiene facturas y las envía al sistema RPA para procesamiento
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
export const sendToRPA = async (req, res) => {
  try {
    console.log('🔄 Iniciando proceso de envío al RPA...');

    // 1. Obtener facturas (reutiliza la lógica existente)
    const result = await invoiceService.getDocumentaryRecordAll();

    console.log(`📊 Facturas obtenidas: ${result.total} totales`);

    // 2. Enviar datos al RPA
    const rpaResult = await rpaIntegrationService.sendToRPA(result);

    // 3. Responder con resultado combinado
    res.status(200).json({
      status: 'success',
      message: 'Proceso completado',
      invoices: {
        total: result.total,
        singleOrderCount: result.singleOrder.count,
        multiOrderCount: result.multiOrder.count
      },
      rpa: rpaResult
    });

  } catch (error) {
    console.error('❌ Error en sendToRPA:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error al procesar la solicitud',
      details: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

/**
 * Verifica el estado del servicio RPA
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
export const checkRPAStatus = async (req, res) => {
  try {
    const health = await rpaIntegrationService.checkRPAHealth();

    res.status(health.available ? 200 : 503).json({
      status: health.available ? 'success' : 'error',
      message: health.available ? 'Servicio RPA disponible' : 'Servicio RPA no disponible',
      rpaStatus: health
    });
  } catch (error) {
    console.error('Error verificando estado RPA:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error al verificar estado del RPA',
      details: error.message
    });
  }
};

/**
 * Actualiza el estado de una factura a 'RegistroDocumental'
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
export const updateInvoiceStatusToDocumentary = async (req, res) => {
  try {
    const { numeroFactura, nit, radicado } = req.body;

    console.log('📝 Actualizando estado de factura:', { numeroFactura, nit, radicado });

    const result = await invoiceService.updateInvoiceStatusToDocumentary(numeroFactura, nit, radicado);

    res.status(200).json({
      status: 'success',
      message: result.message,
      data: {
        numeroFactura,
        nit,
        radicado,
        nuevoEstado: 'RegistroDocumental',
        rowsAffected: result.rowsAffected
      }
    });
  } catch (error) {
    console.error('❌ Error en updateInvoiceStatusToDocumentary:', error);
    
    res.status(error.success === false ? 400 : 500).json({
      status: 'error',
      message: error.message || 'Error al actualizar el estado de la factura',
      ...(process.env.NODE_ENV === 'development' && { details: error })
    });
  }
};

export default {
  getDocumentaryRecordSingleOrder,
  getDocumentaryRecordMultiOrder,
  getDocumentaryRecordAll,
  sendToRPA,
  checkRPAStatus,
  updateInvoiceStatusToDocumentary
};
