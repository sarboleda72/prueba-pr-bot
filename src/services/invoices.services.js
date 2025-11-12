const axios = require('axios');
const Entity = require('../models/Entity.model');
const Acuse = require('../models/Acuse.model');
const Invoice = require('../models/Invoice.model');
const Reporte = require('../models/Reporte.model');
const ResponseModel = require('../models/Response.model');
const excel = require('../utils/excel.utils');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

const create = async (invoiceData) => {
  const transaction = await sequelize.transaction();
  try {
    let issuer = await Entity.findOne({ where: { nit: invoiceData.issuer.nit }, transaction });
    if (!issuer) {
      issuer = await Entity.create({ name: invoiceData.issuer.name, nit: invoiceData.issuer.nit }, { transaction });
    }

    let receiver = await Entity.findOne({ where: { nit: invoiceData.receiver.nit }, transaction });
    if (!receiver) {
      receiver = await Entity.create({ name: invoiceData.receiver.name, nit: invoiceData.receiver.nit }, { transaction });
    }

    let paymentMethod = "";
    try {
      const etlResponse = await axios.post(`${process.env.ETL_WS}/procesar-pdf`, { pdf: invoiceData.pdf });
      if (etlResponse.status === 200 && etlResponse.data?.data?.formaPago) {
        paymentMethod = etlResponse.data.data.formaPago;
      }
    } catch (e) {
      // Si falla la petición, paymentMethod queda vacío
      paymentMethod = "";
    }

    const acuse = await Acuse.findOne({
      where: {
        status030: invoiceData.acuses.status030,
        status031: invoiceData.acuses.status031,
        status032: invoiceData.acuses.status032,
        status033: invoiceData.acuses.status033,
      },
      transaction
    });

    if (!acuse) {
      throw new Error("No se econtró un acuse con los estados proporcionados");
    }

    const newInvoice = await Invoice.create({
      clientName: invoiceData.clientName,
      clientDocument: invoiceData.clientDocument,
      batch: invoiceData.batch,
      cufe: invoiceData.cufe,
      series: invoiceData.series,
      folio: invoiceData.folio,
      issueDate: invoiceData.issueDate,
      processingDate: new Date(),
      paymentMethod: paymentMethod,
      vat: invoiceData.vat,
      total: invoiceData.total,
      issuerId: issuer.id,
      receiverId: receiver.id,
      acuseId: acuse.id,
    }, { transaction });

    // Marcar el reporte correspondiente como procesado
    await Reporte.update(
      { processingStatus: 'procesado' },
      {
        where: {
          cufeCude: invoiceData.cufe,
          batch: invoiceData.batch
        },
        transaction
      }
    );

    await transaction.commit();
    return newInvoice;

  } catch (error) {
    await transaction.rollback();
    throw ResponseModel.set(500, error.message || "Error al crear la factura.");
  }
};

const generateReport = async (batches) => {
  try {
    const invoices = await Invoice.findAll({
      where: { batch: batches },
      include: [
        {
          model: Entity,
          as: 'issuer',
          attributes: ['id', 'name', 'nit'],
        },
        {
          model: Entity,
          as: 'receiver',
          attributes: ['id', 'name', 'nit'],
        },
        {
          model: Acuse,
          as: 'acuse',
          attributes: ['id', 'status030', 'status031', 'status032', 'status033'],
        },
      ],
      order: [['batch', 'ASC']],
    });

    if (!invoices || invoices.length === 0) {
      throw new Error("No se encontraron facturas para el lote proporcionado");
    }

    const mappedInvoices = invoices.map((invoice) => ({
      clienteNombre: invoice.clientName,
      clienteDocumento: invoice.clientDocument,
      lote: invoice.batch,
      cufe: invoice.cufe,
      serie: invoice.series,
      folio: invoice.folio,
      fechaEmision: invoice.issueDate,
      fechaProcesamiento: invoice.processingDate,
      metodoPago: invoice.paymentMethod,
      iva: invoice.vat,
      total: invoice.total,
      emisorNombre: invoice.issuer?.name,
      emisorNit: invoice.issuer?.nit,
      receptorNombre: invoice.receiver?.name,
      receptorNit: invoice.receiver?.nit,
      acuse030: invoice.acuse?.status030,
      acuse031: invoice.acuse?.status031,
      acuse032: invoice.acuse?.status032,
      acuse033: invoice.acuse?.status033,
    }));

    const excelBase64 = await excel.create(mappedInvoices);

    return excelBase64;
  } catch (error) {
    throw ResponseModel.set(500, error.message || "Error al generar el reporte.");
  }
};

const getMissingInvoices = async () => {
  try {
    const { Op } = require('sequelize');

    // Primero obtenemos todas las combinaciones únicas de cufe y batch de facturas
    const existingInvoices = await Invoice.findAll({
      attributes: ['cufe', 'batch'],
      group: ['cufe', 'batch'],
      raw: true
    });

    // Creamos un Set para búsqueda más eficiente
    const existingCombinations = new Set(
      existingInvoices.map(invoice => `${invoice.cufe}|${invoice.batch}`)
    );

    // Obtenemos todos los reportes únicos
    const reportes = await Reporte.findAll({
      attributes: ['cufeCude', 'batch', 'clientName', 'clientDocument'],
      group: ['cufeCude', 'batch', 'clientName', 'clientDocument'],
      order: [['batch', 'ASC']],
      raw: true
    });

    // Filtramos los que NO existen en facturas
    const missingRecords = reportes.filter(reporte => {
      const combination = `${reporte.cufeCude}|${reporte.batch}`;
      return !existingCombinations.has(combination);
    });

    return {
      totalMissing: missingRecords.length,
      records: missingRecords.map(record => ({
        cufeCude: record.cufeCude,
        batch: record.batch,
        clientName: record.clientName,
        clientDocument: record.clientDocument
      }))
    };
  } catch (error) {
    console.error('Error al consultar facturas faltantes:', error);
    throw ResponseModel.set(500, error.message || "Error al consultar facturas faltantes.");
  }
};

const getNextPendingInvoice = async () => {
  const transaction = await sequelize.transaction();
  try {

    // Primero liberamos registros con timeout (más de 5 minutos asignados)
    const timeoutThreshold = new Date(Date.now() - 5 * 60 * 1000); // 5 minutos atrás
    
    await Reporte.update(
      { 
        processingStatus: 'pendiente', 
        assignedAt: null 
      },
      {
        where: {
          processingStatus: 'asignado',
          assignedAt: { [Op.lt]: timeoutThreshold }
        },
        transaction
      }
    );

    // Buscar el siguiente reporte pendiente que NO existe en facturas
    const nextReporte = await Reporte.findOne({
      where: {
        processingStatus: 'pendiente',
        [Op.and]: [
          sequelize.literal(`
            NOT EXISTS (
              SELECT 1 FROM facturas f 
              WHERE f.cufe = "Reporte".cufe_cude AND f.lote = "Reporte".lote
            )
          `)
        ]
      },
      order: [['batch', 'ASC'], ['folio', 'ASC']],
      transaction
    });

    if (!nextReporte) {
      await transaction.commit();
      return null; // No hay reportes pendientes
    }

    // Marcar como asignado
    await nextReporte.update(
      { 
        processingStatus: 'asignado', 
        assignedAt: new Date() 
      },
      { transaction }
    );

    await transaction.commit();

    return {
      cufeCude: nextReporte.cufeCude,
      batch: nextReporte.batch,
      clientName: nextReporte.clientName,
      clientDocument: nextReporte.clientDocument
    };

  } catch (error) {
    await transaction.rollback();
    console.error('Error al obtener siguiente factura pendiente:', error);
    throw ResponseModel.set(500, error.message || "Error al obtener siguiente factura pendiente.");
  }
};

const getBatchSummary = async () => {
  try {
    const { QueryTypes } = require('sequelize');

    const query = `
      SELECT 
        r.lote as batch,
        r.cliente_nombre as clientName,
        r.cliente_documento as clientDocument,
        COUNT(*) as totalRecords,
        SUM(CASE WHEN r.estado_proceso = 'procesado' THEN 1 ELSE 0 END) as processedRecords,
        SUM(CASE WHEN r.estado_proceso = 'pendiente' THEN 1 ELSE 0 END) as pendingRecords,
        SUM(CASE WHEN r.estado_proceso = 'asignado' THEN 1 ELSE 0 END) as assignedRecords,
        MIN(r.fecha_creacion) as creationDate,
        MIN(CASE WHEN r.estado_proceso = 'procesado' THEN r.fecha_asignacion END) as firstProcessedDate,
        MAX(CASE WHEN r.estado_proceso = 'procesado' THEN r.fecha_asignacion END) as lastProcessedDate,
        ROUND(
          (SUM(CASE WHEN r.estado_proceso = 'procesado' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 
          2
        ) as progressPercentage
      FROM reportes r
      GROUP BY r.lote, r.cliente_nombre, r.cliente_documento
      ORDER BY MIN(r.fecha_creacion) DESC
    `;

    const results = await sequelize.query(query, { type: QueryTypes.SELECT });

    return {
      totalBatches: results.length,
      batches: results.map(batch => ({
        batch: batch.batch,
        clientName: batch.clientname,
        clientDocument: batch.clientdocument,
        totalRecords: parseInt(batch.totalrecords),
        processedRecords: parseInt(batch.processedrecords),
        pendingRecords: parseInt(batch.pendingrecords),
        assignedRecords: parseInt(batch.assignedrecords),
        progressPercentage: parseFloat(batch.progresspercentage),
        creationDate: batch.creationdate,
        firstProcessedDate: batch.firstprocesseddate,
        lastProcessedDate: batch.lastprocesseddate
      }))
    };
  } catch (error) {
    console.error('Error al obtener resumen de lotes:', error);
    throw ResponseModel.set(500, error.message || "Error al obtener resumen de lotes.");
  }
};

module.exports = { create, generateReport, getMissingInvoices, getNextPendingInvoice, getBatchSummary };