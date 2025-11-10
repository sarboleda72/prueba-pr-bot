/**
 * @fileoverview Servidor principal con procesamiento automático de facturas
 * Configura el servidor Express y ejecuta bucles de descarga automática
 */

const dotenv = require('dotenv');
const app = require('./routes.js')
const express = require('express');
const support = require('./services/invoiceDownload.service');
const ZentriaAPI = require('./models/ZentriaAPI.model');

dotenv.config();

const port = process.env.PORT || 3000;

/**
 * Inicia el servidor HTTP
 * @description Configura el servidor para escuchar en el puerto especificado
 */
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

/**
 * Ejecuta el bucle de descarga automática de facturas
 * @async
 * @function runDowloadLoop
 * @returns {Promise<void>}
 * @description Obtiene facturas pendientes de la API Zentria y las procesa automáticamente
 * cada 30 segundos. Maneja errores y continúa el bucle indefinidamente.
 */
async function runDowloadLoop() {
  try {
    const zentriaAPI = new ZentriaAPI();
    let invoiceList = await zentriaAPI.getInvoice();
    
    // Verificar si la respuesta tiene la nueva estructura con list_invoices
    if (invoiceList && invoiceList.list_invoices) {
      invoiceList = invoiceList.list_invoices;
    }
    
    // Ordenar por nombre de IPS para optimizar las conexiones (agrupar facturas por sede)
    invoiceList = invoiceList.sort((a, b) => {
      const ipsA = a.nombre_ips || '';
      const ipsB = b.nombre_ips || '';
      // Primero ordenar por IPS, luego por número de factura
      if (ipsA !== ipsB) {
        return ipsA.localeCompare(ipsB);
      }
      const numeroA = a.numero_factura || a;
      const numeroB = b.numero_factura || b;
      return numeroA.localeCompare(numeroB);
    });
    
    await support.download({ invoices: invoiceList });
    console.log('Descarga de facturas finalizada. Esperando 30 minutos para volver a ejecutar...');
  } catch (error) {
    console.error('Error en descarga factura:', error.message);
    console.log('Descarga de facturas finalizada. Esperando 30 minutos para volver a ejecutar...');
  }
  setTimeout(runDowloadLoop, 30 * 60 * 1000); // 30 minutos en milisegundos
}

// Inicia el ciclo automático
runDowloadLoop();
