/**
 * @fileoverview Servicio de Facturas
 * @module services/invoiceService
 * @description Capa de lógica de negocio para operaciones relacionadas con facturas
 */

import invoiceRepository from '../repositories/invoice.repository.js';

/**
 * Obtiene el registro documental de facturas con orden única
 * @returns {Promise<Object>} Objeto con el resultado de la consulta
 */
export const getDocumentaryRecordSingleOrder = async () => {
  try {
    const invoices = await invoiceRepository.getDocumentaryRecordSingleOrder();

    return {
      success: true,
      count: invoices.length,
      data: invoices
    };
  } catch (error) {
    throw {
      success: false,
      message: 'Error al obtener el registro documental de orden única',
      error: error.message
    };
  }
};

/**
 * Obtiene el registro documental de facturas con multiorden
 * @returns {Promise<Object>} Objeto con el resultado de la consulta
 */
export const getDocumentaryRecordMultiOrder = async () => {
  try {
    const invoices = await invoiceRepository.getDocumentaryRecordMultiOrder();

    return {
      success: true,
      count: invoices.length,
      data: invoices
    };
  } catch (error) {
    throw {
      success: false,
      message: 'Error al obtener el registro documental de multiorden',
      error: error.message
    };
  }
};

/**
 * Obtiene el registro documental completo (orden única y multiorden)
 * @returns {Promise<Object>} Objeto con ambos tipos de facturas separadas
 */
export const getDocumentaryRecordAll = async () => {
  try {
    const result = await invoiceRepository.getDocumentaryRecordAll();

    return {
      success: true,
      singleOrder: {
        count: result.singleOrder.length,
        data: result.singleOrder
      },
      multiOrder: {
        count: result.multiOrder.length,
        data: result.multiOrder
      },
      total: result.singleOrder.length + result.multiOrder.length
    };
  } catch (error) {
    throw {
      success: false,
      message: 'Error al obtener el registro documental completo',
      error: error.message
    };
  }
};

/**
 * Actualiza el estado de una factura a 'RegistroDocumental'
 * @param {string} numeroFactura - Número de la factura
 * @param {string} nit - NIT del proveedor
 * @param {string} radicado - Número de radicado
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateInvoiceStatusToDocumentary = async (numeroFactura, nit, radicado) => {
  try {
    // Validar que los parámetros requeridos estén presentes
    if (!numeroFactura || !nit || !radicado) {
      throw new Error('Faltan parámetros requeridos: numeroFactura, nit y radicado son obligatorios');
    }

    const result = await invoiceRepository.updateInvoiceStatusToDocumentary(numeroFactura, nit, radicado);

    if (!result.updated) {
      throw new Error('No se encontró ninguna factura con los criterios especificados');
    }

    return {
      success: true,
      message: 'Estado de factura actualizado a RegistroDocumental',
      rowsAffected: result.rowsAffected
    };
  } catch (error) {
    throw {
      success: false,
      message: error.message || 'Error al actualizar el estado de la factura',
      error: error.message
    };
  }
};

export default {
  getDocumentaryRecordSingleOrder,
  getDocumentaryRecordMultiOrder,
  getDocumentaryRecordAll,
  updateInvoiceStatusToDocumentary
};
