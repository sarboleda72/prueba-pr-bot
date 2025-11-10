// ✅ EJEMPLO CORRECTO
// Modelo en PascalCase (permitido en carpeta models/)
// Usando Sequelize con excepción de framework

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Modelo de Usuario
 * Define la estructura de la tabla users
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'last_name'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  roleId: {
    type: DataTypes.INTEGER,
    field: 'role_id'
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

module.exports = User;
