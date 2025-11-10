// ❌ EJEMPLO INCORRECTO
// Modelo fuera de carpeta models/ con nombre PascalCase (no permitido)
// Debería estar en models/ o usar kebab-case

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Modelo de producto con ubicación incorrecta
 */
const Product = sequelize.define('Product', { // ❌ PascalCase fuera de models/
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  product_name: { // ❌ snake_case en definición
    type: DataTypes.STRING
  },
  product_price: { // ❌ snake_case
    type: DataTypes.DECIMAL
  }
});

module.exports = Product;
