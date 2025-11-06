/**
 * @fileoverview Repositorio de Facturas
 * @module repositories/invoiceRepository
 * @description Capa de acceso a datos para operaciones con la tabla facturas
 */

import { Invoice } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Obtiene facturas con registro documental de orden única
 * @returns {Promise<Array>} Lista de facturas que cumplen los criterios
 */
export const getDocumentaryRecordSingleOrder = async () => {
  try {
    const invoices = await Invoice.findAll({
      where: {
        dependencia: {
          [Op.in]: ['Provedor', 'Cuenta Cobro']
        },
        estado: 'Radicada',
        orden: {
          [Op.ne]: 'Vacio'
        },
        multiorden: {
          [Op.in]: ['Pendiente', 'No']
        }
      },
      raw: true
    });

    return invoices;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtiene facturas con registro documental de multiorden
 * @returns {Promise<Array>} Lista de facturas que cumplen los criterios
 */
export const getDocumentaryRecordMultiOrder = async () => {
  try {
    const invoices = await Invoice.findAll({
      where: {
        dependencia: {
          [Op.in]: ['Provedor', 'Cuenta Cobro']
        },
        estado: 'RadicadaMultiorden',
        multiorden: 'Si'
      },
      raw: true
    });

    // 🔍 LOG TEMPORAL: Ver qué retorna realmente
    console.log('🔍 MultiOrden - Registros encontrados:', invoices.length);
    if (invoices.length > 0) {
      console.log('🔍 Primer registro:', JSON.stringify(invoices[0], null, 2));
    }

    return invoices;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtiene facturas con registro documental (orden única y multiorden)
 * @returns {Promise<Object>} Objeto con facturas separadas por tipo
 */
export const getDocumentaryRecordAll = async () => {
  try {
    const [singleOrder, multiOrder] = await Promise.all([
      getDocumentaryRecordSingleOrder(),
      getDocumentaryRecordMultiOrder()
    ]);

    return {
      singleOrder,
      multiOrder
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Actualiza el estado de una factura a 'RegistroDocumental'
 * @param {string} numeroFactura - Número de la factura
 * @param {string} nit - NIT del proveedor
 * @param {string} radicado - Número de radicado
 * @returns {Promise<Object>} Resultado de la actualización
 */
export const updateInvoiceStatusToDocumentary = async (numeroFactura, nit, radicado) => {
  try {
    // Usar los nombres de las propiedades del modelo (camelCase)
    // Sequelize los mapea automáticamente a los nombres de columna (snake_case)
    const [updatedRows] = await Invoice.update(
      { status: 'RegistroDocumental' },
      {
        where: {
          invoiceNumber: numeroFactura,
          nit: nit,
          radication: radicado
        }
      }
    );

    return {
      updated: updatedRows > 0,
      rowsAffected: updatedRows
    };
  } catch (error) {
    throw error;
  }
};

export default {
  getDocumentaryRecordSingleOrder,
  getDocumentaryRecordMultiOrder,
  getDocumentaryRecordAll,
  updateInvoiceStatusToDocumentary
};
