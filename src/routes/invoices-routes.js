const express = require('express');
const path = require('path');
const invoices = require('../controllers/invoices-controller');
const authJwt = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authJwt.isAuthenticatedMW, invoices.createInvoice);
router.post('/reporte', invoices.generateReport);
router.get('/faltantes', authJwt.isAuthenticatedMW, invoices.getMissingInvoices);
router.get('/faltantes/siguiente', authJwt.isAuthenticatedMW, invoices.getNextPendingInvoice);
router.get('/lotes', invoices.getBatchSummary);

// Ruta para servir el dashboard HTML
router.get('/dashboard', (req, res) => {
  const dashboardPath = path.join(__dirname, '../views/dashboard.html');
  res.sendFile(dashboardPath);
});

module.exports = router;