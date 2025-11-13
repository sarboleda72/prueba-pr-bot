const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const { isAuthenticatedMW } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Ruta para subir archivo Excel y procesar reportes
router.post('/upload', upload.single('excel'), reportsController.uploadExcelReport);

module.exports = router;