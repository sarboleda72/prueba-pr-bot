/**
 * @fileoverview Modelo de Orden
 * @module models/Order
 * @description Modelo de Sequelize para la tabla ordenes - gestiona órdenes de compra y órdenes de servicio
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  orderType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'tipo_orden'
  },
  order: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'orden'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'fecha'
  },
  nit: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'nit'
  },
  name: {
    type: DataTypes.STRING(300),
    allowNull: true,
    field: 'nombre'
  },
  fund: {
    type: DataTypes.STRING(300),
    allowNull: true,
    field: 'fondo'
  },
  subtotal: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'subtotal'
  },
  invoiceNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'numero_factura'
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Pendiente',
    field: 'descripcion'
  }
}, {
  tableName: 'ordenes',
  timestamps: false,
  underscored: true
});

export default Order;
