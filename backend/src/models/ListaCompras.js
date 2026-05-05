const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ListaCompras = sequelize.define('ListaCompras', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre_producto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.FLOAT,
    defaultValue: 1
  },
  comprado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: false,
  tableName: 'Lista_Compras'
});

module.exports = ListaCompras;
