const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  unidad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_entrada: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_caducidad: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  timestamps: false,
  tableName: 'Productos'
});

module.exports = Producto;
