const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Entity = require('./Entity_model');
const Acuse = require('./Acuse-.model');

const Invoice = sequelize.define('INVOICE', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  clientName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'cliente_nombre',
  },
  clientDocument: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'cliente_documento',
  },
  batch: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'lote',
  },
  cufe: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  series: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'serie',
  },
  folio: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  issueDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecha_emision',
  },
  processingDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecha_procesamiento',
  },
  paymentMethod: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'metodo_pago',
  },
  vat: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: true,
    field: 'iva',
  },
  total: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: true,
  },
  issuerId: {
    type: DataTypes.INTEGER,
    references: {
      model: Entity,
      key: 'id',
    },
    field: 'emisor_id',
  },
  receiverId: {
    type: DataTypes.INTEGER,
    references: {
      model: Entity,
      key: 'id',
    },
    field: 'receptor_id',
  },
  acuseId: {
    type: DataTypes.INTEGER,
    references: {
      model: Acuse,
      key: 'id',
    },
    field: 'acuse_id',
  },
}, {
  timestamps: false,
  tableName: 'facturas',
});

Invoice.belongsTo(Entity, { as: 'issuer', foreignKey: 'issuerId' });
Invoice.belongsTo(Entity, { as: 'receiver', foreignKey: 'receiverId' });
Invoice.belongsTo(Acuse, { as: 'acuse', foreignKey: 'acuseId' });

module.exports = Invoice;