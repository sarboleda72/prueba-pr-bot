/**
 * @fileoverview Configuración de rutas y middlewares principales
 * Define el enrutador principal de la aplicación con health check y rutas de descarga
 */

const express = require('express');
const downloadRoutes = require('./routes/downloadInvoice.routes');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const app = express();

// Middlewares globales
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

/**
 * Health check endpoint
 * @route GET /
 * @returns {Object} Status de la aplicación con timestamp
 * @description Endpoint para verificar que la aplicación está funcionando correctamente
 */
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'API de descarga de facturas funcionando correctamente'
  });
});

// Rutas de descarga de facturas
app.use('/', downloadRoutes);

/**
 * @exports app - Aplicación Express configurada con todas las rutas y middlewares
 */
module.exports = app;