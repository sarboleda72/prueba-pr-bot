const reportsService = require('../services/reports.services');
const ResponseModel = require('../models/Response.model');

const uploadExcelReport = async (req, res) => {
  try {
    // Validar que se haya subido un archivo
    if (!req.file) {
      return res.status(400).json(ResponseModel.set(400, "Es requerido subir un archivo Excel."));
    }
    
    // Obtener parámetros del body
    const { clienteNombre, clienteDocumento} = req.body;
    
    // Validar que el archivo tenga contenido
    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json(ResponseModel.set(400, "El archivo Excel no puede estar vacío."));
    }
    
    console.log('Procesando archivo:', req.file.originalname, 'Tamaño:', req.file.size, 'bytes');
    console.log('Parámetros:', { clienteNombre, clienteDocumento });
    
    const result = await reportsService.processExcelReport(req.file.buffer, clienteNombre, clienteDocumento, true);
    
    return res.status(201).json(ResponseModel.set(201, result.message, {
      totalProcessed: result.totalProcessed,
      totalInserted: result.totalInserted,
      batch: result.batch
    }));
    
  } catch (error) {
    console.error("Error al procesar el archivo Excel:", error);
    return res.status(500).json(ResponseModel.set(500, error.message || "Error al procesar el archivo Excel."));
  }
};

module.exports = {
  uploadExcelReport
};