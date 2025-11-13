const Reporte = require('../models/Reporte-model');
const ResponseModel = require('../models/Response-model');
const excelUtils = require('../utils/excel.utils');
const sequelize = require('../config/database');

const processExcelReport = async (excelData, clientName, clientDocument, isBuffer = false) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Generar lote único: año+mes+dia+hora+minutos+segundos
    const now = new Date();
    const batch = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    
    // Leer y parsear el archivo Excel
    let jsonData;
    if (isBuffer) {
      jsonData = await excelUtils.readExcelFromBuffer(excelData);
    } else {
      jsonData = await excelUtils.readExcelFromBase64(excelData);
    }
    const parsedData = excelUtils.parseReportData(jsonData, batch, clientName, clientDocument);
    
    if (!parsedData || parsedData.length === 0) {
      throw new Error('No se encontraron datos válidos en el archivo Excel');
    }
    
    // Validar que todos los registros tengan al menos algunos campos obligatorios
    const validData = parsedData.filter(row => 
      row.cufeCude && (row.issuerNit || row.receiverNit)
    );
    
    if (validData.length === 0) {
      throw new Error('No se encontraron registros válidos en el archivo Excel');
    }
    
    // Insertar los datos en la base de datos
    const createdReports = await Reporte.bulkCreate(validData, { 
      transaction,
      ignoreDuplicates: true // Evitar duplicados si existe un índice único
    });
    
    await transaction.commit();
    
    return {
      totalProcessed: parsedData.length,
      totalInserted: createdReports.length,
      batch: batch,
      message: `Se procesaron ${parsedData.length} registros y se insertaron ${createdReports.length} correctamente`,
      data: createdReports
    };
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error al procesar el reporte:', error);
    throw ResponseModel.set(500, error.message || "Error al procesar el archivo Excel.");
  }
};

module.exports = {
  processExcelReport
};