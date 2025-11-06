/**
 * @fileoverview Modelo de Factura Radicada
 * @module models/RadicatedInvoice
 * @description Modelo de Sequelize para la tabla facturas_radicadas - gestiona facturas que han sido radicadas oficialmente
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const RadicatedInvoice = sequelize.define('RadicatedInvoice', {
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
  subtotal: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    field: 'subtotal'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'nombre'
  },
  radication: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'radicado'
  },
  monthSheet: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'hoja_mes'
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
  orderNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'numero_orden'
  },
  orderType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'tipo_orden'
  },
  fund: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'fondo'
  },
  year: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'año'
  },
  order: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'orden'
  }
}, {
  tableName: 'facturas_radicadas',
  timestamps: false,
  underscored: true
});

export default RadicatedInvoice;
