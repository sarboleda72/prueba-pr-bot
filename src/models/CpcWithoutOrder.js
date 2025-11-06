/**
 * @fileoverview Modelo de CPC Sin Orden
 * @module models/CpcWithoutOrder
 * @description Modelo de Sequelize para la tabla cpc_sinorden - gestiona registros de CPC sin órdenes asociadas
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CpcWithoutOrder = sequelize.define('CpcWithoutOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  costCenter: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'centro_costo'
  },
  account: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'cuenta'
  },
  accountName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'nombre_cuenta'
  },
  nit: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'nit'
  },
  attachment: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'anexo'
  },
  cpc: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'cpc'
  },
  fund: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'PB',
    field: 'fondo'
  }
}, {
  tableName: 'cpc_sinorden',
  timestamps: false,
  underscored: true
});

export default CpcWithoutOrder;
