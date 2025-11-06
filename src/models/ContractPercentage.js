/**
 * @fileoverview Modelo de Porcentaje de Contrato
 * @module models/ContractPercentage
 * @description Modelo de Sequelize para la tabla porcentajes_contratos - gestiona distribuciones de porcentajes para contratos
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ContractPercentage = sequelize.define('ContractPercentage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  provider: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'provedor'
  },
  nit: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'nit'
  },
  contract: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'contrato'
  },
  pb: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'pb'
  },
  pv: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'pv'
  }
}, {
  tableName: 'porcentajes_contratos',
  timestamps: false,
  underscored: true
});

export default ContractPercentage;
