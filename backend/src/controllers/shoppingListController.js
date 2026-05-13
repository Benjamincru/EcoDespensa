const { ListaCompras, Producto } = require('../models');
const { Op } = require('sequelize');

// Obtener la lista de compras del usuario
exports.getShoppingList = async (req, res) => {
    try {
        const list = await ListaCompras.findAll({
            where: { usuario_id: req.user.id }
        });
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la lista", error: error.message });
    }
};

// Sincronizar automáticamente la lista basada en el inventario
exports.syncAutoList = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const hoy = new Date();

        // 1. Buscar productos terminados o por agotarse (cantidad < 1) o caducados
        const productosCriticos = await Producto.findAll({
            where: {
                usuario_id,
                [Op.or]: [
                    { cantidad: { [Op.lte]: 1 } }, // Se está agotando
                    { fecha_caducidad: { [Op.lt]: hoy } } // Caducó
                ]
            }
        });

        const itemsAgregados = [];

        for (const prod of productosCriticos) {
            // Verificar si ya existe en la lista de compras y NO ha sido comprado todavía
            const existe = await ListaCompras.findOne({
                where: {
                    usuario_id,
                    nombre_producto: prod.nombre,
                    comprado: false
                }
            });

            if (!existe) {
                const newItem = await ListaCompras.create({
                    usuario_id,
                    nombre_producto: prod.nombre,
                    cantidad: 1, // Por defecto pedir 1 más
                    comprado: false
                });
                itemsAgregados.push(newItem);
            }
        }

        res.status(200).json({
            message: "Sincronización completada",
            agregados: itemsAgregados.length,
            items: itemsAgregados
        });
    } catch (error) {
        res.status(500).json({ message: "Error en sincronización automática", error: error.message });
    }
};

// Añadir manual
exports.addItem = async (req, res) => {
    try {
        const newItem = await ListaCompras.create({
            ...req.body,
            usuario_id: req.user.id
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: "Error al añadir a la lista", error: error.message });
    }
};

// Marcar como comprado / pendiente
exports.toggleBought = async (req, res) => {
    try {
        const item = await ListaCompras.findOne({
            where: { id: req.params.id, usuario_id: req.user.id }
        });
        if (!item) return res.status(404).json({ message: "Item no encontrado" });
        
        item.comprado = !item.comprado;
        await item.save();
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar item", error: error.message });
    }
};

// Eliminar de la lista
exports.deleteItem = async (req, res) => {
    try {
        await ListaCompras.destroy({
            where: { id: req.params.id, usuario_id: req.user.id }
        });
        res.status(200).json({ message: "Item eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar item", error: error.message });
    }
};
