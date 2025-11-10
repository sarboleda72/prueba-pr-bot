/**
 * @fileoverview Modelo de datos para información de facturas
 * Define la estructura de datos para facturas médicas del sistema Gomedisys
 */

/**
 * Clase que representa la información de una factura médica
 * @class InvoiceInfo
 * @description Modelo de datos que encapsula toda la información relevante de una factura,
 * incluyendo datos del paciente, responsable, contrato y estado
 */
class InvoiceInfo {
  /**
   * Constructor de la clase InvoiceInfo
   * @constructor
   * @param {Object} data - Datos de la factura
   * @param {string|null} data.idInvoice - ID único de la factura
   * @param {string|null} data.invoiceNumber - Número de la factura
   * @param {string|null} data.encounterNumber - Número del encuentro médico
   * @param {string|null} data.patient - Nombre del paciente
   * @param {string|null} data.documentNumber - Número de documento del paciente
   * @param {string|null} data.responsible - Responsable de la factura
   * @param {string|null} data.invoiceDate - Fecha de la factura
   * @param {string|null} data.contractNumber - Número del contrato
   * @param {string|null} data.namePlan - Nombre del plan médico
   * @param {string|null} data.invoiceState - Estado actual de la factura
   * @param {number|null} data.countPDF - Cantidad de PDFs asociados
   * @description Inicializa una nueva instancia de InvoiceInfo con los datos proporcionados
   */
  constructor({ idInvoice, invoiceNumber, encounterNumber, patient, documentNumber, responsible, invoiceDate, contractNumber, namePlan, invoiceState, countPDF }) {
    this.idInvoice = idInvoice;
    this.invoiceNumber = invoiceNumber;
    this.encounterNumber = encounterNumber;
    this.patient = patient;
    this.documentNumber = documentNumber;
    this.responsible = responsible;
    this.invoiceDate = invoiceDate;
    this.contractNumber = contractNumber;
    this.namePlan = namePlan;
    this.invoiceState = invoiceState;
    this.countPDF = countPDF;
  }
}

module.exports = { InvoiceInfo };