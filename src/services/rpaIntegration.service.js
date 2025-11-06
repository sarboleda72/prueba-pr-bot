/**
 * @fileoverview Servicio de Integración con RPA (JSP7)
 * @module services/rpaIntegrationService
 * @description Envía datos de facturas a la API FastAPI para procesamiento automatizado RPA
 */

import axios from 'axios';

// URL de la API FastAPI RPA (ajustar según configuración)
const RPA_API_URL = process.env.RPA_API_URL || 'http://localhost:8000';

/**
 * Envía facturas al sistema RPA para procesamiento automático
 * @param {Object} data - Datos de facturas separados por tipo
 * @param {Object} data.singleOrder - Objeto con facturas de orden única
 * @param {number} data.singleOrder.count - Cantidad de facturas orden única
 * @param {Array} data.singleOrder.data - Array de facturas orden única
 * @param {Object} data.multiOrder - Objeto con facturas de multiorden
 * @param {number} data.multiOrder.count - Cantidad de facturas multiorden
 * @param {Array} data.multiOrder.data - Array de facturas multiorden
 * @param {number} data.total - Total de facturas
 * @returns {Promise<Object>} Respuesta del sistema RPA
 */
export const sendToRPA = async (data) => {
  try {
    console.log('📤 Enviando datos al RPA...');
    console.log(`   - Orden única: ${data.singleOrder.count} facturas`);
    console.log(`   - Multiorden: ${data.multiOrder.count} facturas`);
    console.log(`   - Total: ${data.total} facturas`);

    const response = await axios.post(
      `${RPA_API_URL}/api/v1/sequences/registro_documental/execute_test`,
      {
        singleOrder: data.singleOrder,
        multiOrder: data.multiOrder,
        total: data.total,
        timestamp: new Date().toISOString(),
        source: 'camara-comercio-api'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 segundos timeout
      }
    );

    console.log('✅ Datos enviados al RPA correctamente');
    console.log(`   Respuesta RPA: ${JSON.stringify(response.data)}`);

    return {
      success: true,
      message: 'Datos enviados al RPA correctamente',
      rpaResponse: response.data,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error enviando datos al RPA:', error.message);
    
    // Capturar detalles del error
    const errorDetails = {
      message: error.message,
      code: error.code,
      response: error.response?.data || null,
      status: error.response?.status || null
    };

    console.error('   Detalles:', errorDetails);

    return {
      success: false,
      message: 'Error al enviar datos al RPA',
      error: error.message,
      details: errorDetails,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Verifica si el servicio RPA está disponible
 * @returns {Promise<Object>} Estado del servicio RPA
 */
export const checkRPAHealth = async () => {
  try {
    const response = await axios.get(`${RPA_API_URL}/api/v1/status`, {
      timeout: 5000
    });

    return {
      available: true,
      status: response.data
    };
  } catch (error) {
    return {
      available: false,
      error: error.message
    };
  }
};

export default {
  sendToRPA,
  checkRPAHealth
};
