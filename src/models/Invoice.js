/**
 * @fileoverview Modelo de Factura
 * @module models/Invoice
 * @description Modelo de Sequelize para la tabla facturas - gestiona registros de facturas con información completa de facturación
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  invoiceNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'numero_factura'
  },
  nit: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'nit'
  },
  order: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'orden'
  },
  orderType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'tipo_orden'
  },
  name: {
    type: DataTypes.STRING(300),
    allowNull: true,
    field: 'nombre'
  },
  amount: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'importe'
  },
  vat: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    field: 'iva'
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'dependencia'
  },
  status: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'estado'
  },
  processed: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'procesado'
  },
  validationDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'fecha_validacion'
  },
  xmlDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'fecha_xml'
  },
  pdfBase64: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'pdfbase64'
  },
  fileName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'nombre_archivo'
  },
  invoicePrefix: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'prefijo_factura'
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'subtotal'
  },
  rejection: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'rechazo'
  },
  paymentMethod: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'metodo_pago'
  },
  radication: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'radicado'
  },
  creditNote: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'nota_credito'
  },
  fund: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'fondo'
  },
  number: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'numero'
  },
  year: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'ano'
  },
  orderNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'numero_orden'
  },
  multiOrder: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'multiorden'
  },
  receipt: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'recibo'
  },
  accountingDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: sequelize.literal('CURRENT_DATE'),
    field: 'fecha_contabilizacion'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'descripcion'
  },
  accountsPayableNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'numero_cxp'
  },
  contract: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'contrato'
  },
  accountedNumber: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'numero_contabilizado'
  },
  vatWithholding: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'No',
    field: 'reteiva'
  },
  sourceWithholding: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'No',
    field: 'retefuente'
  },
  taxCode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'codigo_impuesto'
  },
  chamberStatus: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'estado_camara'
  },
  feesTax: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'honorarios_impuesto'
  },
  driveRecord: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'registro_drive'
  },
  events: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'No',
    field: 'eventos'
  },
  documentShipment: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'No',
    field: 'envio_documentos'
  }
}, {
  tableName: 'facturas',
  timestamps: false,
  underscored: true
});

export default Invoice;
