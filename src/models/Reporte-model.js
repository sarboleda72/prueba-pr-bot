const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reporte = sequelize.define('Reporte', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  documentType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'tipo_documento',
  },
  cufeCude: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'cufe_cude',
  },
  folio: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  prefix: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'prefijo',
  },
  issueDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecha_emision',
  },
  receptionDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecha_recepcion',
  },
  issuerNit: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'nit_emisor',
  },
  issuerName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'nombre_emisor',
  },
  receiverNit: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'nit_receptor',
  },
  receiverName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'nombre_receptor',
  },
  vat: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'iva',
  },
  ica: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  ipc: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'estado',
  },
  group: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'grupo',
  },
  batch: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'lote',
  },
  clientName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'CYT',
    field: 'cliente_nombre',
  },
  clientDocument: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: '900620176',
    field: 'cliente_documento',
  },
  creationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'fecha_creacion',
  },
  processingStatus: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pendiente',
    field: 'estado_proceso',
    validate: {
      isIn: [['pendiente', 'asignado', 'procesado']]
    }
  },
  assignedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecha_asignacion',
  },
}, {
  timestamps: false,
  tableName: 'reportes',
});

module.exports = Reporte;