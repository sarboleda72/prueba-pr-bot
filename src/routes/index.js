/**
 * @fileoverview Configuración principal de rutas
 * @module routes/index
 * @description Define todos los endpoints HTTP y los mapea a sus respectivos controladores
 */

import express from 'express';
import invoiceRoutes from './invoice.routes.js';

const router = express.Router();

// Rutas de facturas
router.use('/invoices', invoiceRoutes);

export default router;
