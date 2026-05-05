const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Producto = require('./Producto');
const ListaCompras = require('./ListaCompras');
const HistorialEco = require('./HistorialEco');

// Relaciones
Usuario.hasMany(Producto, { foreignKey: 'usuario_id' });
Producto.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Categoria.hasMany(Producto, { foreignKey: 'categoria_id' });
Producto.belongsTo(Categoria, { foreignKey: 'categoria_id' });

Usuario.hasMany(ListaCompras, { foreignKey: 'usuario_id' });
ListaCompras.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Usuario.hasMany(HistorialEco, { foreignKey: 'usuario_id' });
HistorialEco.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = {
  sequelize,
  Usuario,
  Categoria,
  Producto,
  ListaCompras,
  HistorialEco
};
