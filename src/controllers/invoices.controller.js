const invoiceService = require('../services/invoices.services');
const ResponseModel = require('../models/Response.model');

// Función para validar si es un PDF válido (validación básica)
const validate_PDF = (pdfData) => {
  try {
    // Si viene con prefijo data:application/pdf;base64, lo removemos
    let base64Data = pdfData;
    if (pdfData.startsWith('data:application/pdf;base64,')) {
      base64Data = pdfData.substring('data:application/pdf;base64,'.length);
    }
    
    // Verificar que sea base64 válido (permitir algunos espacios en blanco)
    const cleanBase64 = base64Data.replace(/\s/g, ''); // Remover espacios en blanco
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
      return { isValid: false, error: 'El PDF no tiene un formato Base64 válido' };
    }
    
    // Convertir base64 a buffer
    const buffer = Buffer.from(cleanBase64, 'base64');
    
    // Verificar tamaño mínimo (al menos 1KB para ser un PDF real)
    if (buffer.length < 1024) {
      return { isValid: false, error: 'El archivo PDF es demasiado pequeño (mínimo 1KB)' };
    }
    
    // Verificar cabecera PDF básica (%PDF)
    const header = buffer.toString('ascii', 0, 4);
    if (!header.startsWith('%PDF')) {
      return { isValid: false, error: 'El archivo no tiene la cabecera de un PDF válido' };
    }
    
    return { 
      isValid: true, 
      size: buffer.length,
      cleanBase64: cleanBase64
    };
    
  } catch (error) {
    return { isValid: false, error: `Error al validar PDF: ${error.message}` };
  }
};

const createInvoice = async (req, res) => {
  const {
    clienteNombre,
    clienteDocumento,
    Lote,
    CUFE,
    nombreEmisor,
    nitEmisor,
    nombreReceptor,
    nitReceptor,
    fechaEmision,
    folio,
    serie,
    IVA,
    total,
    PDF,
    acuses
  } = req.body;

  // Validación de campos requeridos
  if (!clienteNombre || !clienteDocumento || !Lote || !CUFE || !nombreEmisor || !nitEmisor || !nombreReceptor || !nitReceptor || !fechaEmision || !folio || !serie || (total === undefined || total === null) || (IVA === undefined || IVA === null) || !PDF || !acuses) {
    return res.status(400).json(ResponseModel.set(400, "Todos los campos son requeridos."));
  }

  // Validación específica del PDF
  const pdfValidation = validatePDF(PDF);
  if (!pdfValidation.isValid) {
    return res.status(400).json(ResponseModel.set(400, `PDF inválido: ${pdfValidation.error}`));
  }

  console.log(`✅ PDF válido - Tamaño: ${(pdfValidation.size / 1024).toFixed(2)} KB`);

  const invoiceData = {
    clientName: clienteNombre,
    clientDocument: clienteDocumento,
    batch: Lote,
    cufe: CUFE,
    issuer: {
      name: nombreEmisor,
      nit: nitEmisor
    },
    receiver: {
      name: nombreReceptor,
      nit: nitReceptor
    },
    issueDate: fechaEmision,
    folio: folio,
    series: serie,
    vat: IVA || 0,
    total: total,
    pdf: pdfValidation.cleanBase64, // Usar el base64 limpio sin prefijos
    acuses: {
      status030: acuses["030"],
      status031: acuses["031"],
      status032: acuses["032"],
      status033: acuses["033"]
    }
  };

  try {
    const createdInvoice = await invoiceService.create(invoiceData);
    return res.status(200).json(ResponseModel.set(200, "Factura creada correctamente.", createdInvoice));

  } catch (error) {
    console.error("Error al crear la factura:", error);
    return res.status(500).json(error || ResponseModel.set(500, "Error al crear la factura."));
  }
};


const generateReport = async (req, res) => {
  const { lotes, tipoRespuesta } = req.body;

  if (!lotes) {
    return res.status(400).json(ResponseModel.set(400, "El campo 'lote' es requerido."));
  }

  const batches = lotes;
  const responseType = tipoRespuesta;
  const date = new Date().toISOString();

  try {
    const excelBase64 = await invoiceService.generateReport(batches);
    const excelBuffer = Buffer.from(excelBase64, 'base64');

    if (responseType === 'descarga') {
      res.setHeader('Content-Disposition', `attachment; filename="reporte-${date}.xlsx"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      return res.send(excelBuffer);
    }

    return res.status(200).json(ResponseModel.set(200, "Reporte generado correctamente.", { excelBase64 }));
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    return res.status(500).json(ResponseModel.set(500, error.message || "Error al generar el reporte."));
  }
};

const getMissingInvoices = async (req, res) => {
  try {
    const result = await invoiceService.getMissingInvoices();
    return res.status(200).json(ResponseModel.set(200, "Facturas faltantes consultadas correctamente.", result));
  } catch (error) {
    console.error("Error al consultar facturas faltantes:", error);
    return res.status(500).json(ResponseModel.set(500, error.message || "Error al consultar facturas faltantes."));
  }
};

const getNextPendingInvoice = async (req, res) => {
  try {
    const nextInvoice = await invoiceService.getNextPendingInvoice();
    
    if (!nextInvoice) {
      return res.status(404).json(ResponseModel.set(404, "No hay facturas pendientes por procesar."));
    }
    
    return res.status(200).json(ResponseModel.set(200, "Siguiente factura pendiente obtenida correctamente.", nextInvoice));
  } catch (error) {
    console.error("Error al obtener siguiente factura pendiente:", error);
    return res.status(500).json(ResponseModel.set(500, error.message || "Error al obtener siguiente factura pendiente."));
  }
};

const getBatchSummary = async (req, res) => {
  try {
    const result = await invoiceService.getBatchSummary();
    return res.status(200).json(ResponseModel.set(200, "Resumen de lotes obtenido correctamente.", result));
  } catch (error) {
    console.error("Error al obtener resumen de lotes:", error);
    return res.status(500).json(ResponseModel.set(500, error.message || "Error al obtener resumen de lotes."));
  }
};

module.exports = { createInvoice, generateReport, getMissingInvoices, getNextPendingInvoice, getBatchSummary };