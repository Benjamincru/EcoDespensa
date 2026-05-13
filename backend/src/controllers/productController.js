const { Producto, Categoria } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los productos con su categoría
exports.getProducts = async (req, res) => {
    try {
        const products = await Producto.findAll({ 
            where: { usuario_id: req.user.id },
            include: [{ model: Categoria, as: 'Categoria', attributes: ['nombre', 'icono'] }]
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error: error.message });
    }
};

// Obtener estadisticas del inventario
exports.getStats = async (req, res) => {
    try {
        const hoy = new Date();
        const proximoVencimiento = new Date();
        proximoVencimiento.setDate(hoy.getDate() + 7);

        const total = await Producto.count({ where: { usuario_id: req.user.id } });
        
        const caducados = await Producto.count({
            where: {
                usuario_id: req.user.id,
                fecha_caducidad: { [Op.lt]: hoy }
            }
        });

        const porVencer = await Producto.count({
            where: {
                usuario_id: req.user.id,
                fecha_caducidad: {
                    [Op.and]: [
                        { [Op.gte]: hoy },
                        { [Op.lte]: proximoVencimiento }
                    ]
                }
            }
        });

        const frescos = await Producto.count({
            where: {
                usuario_id: req.user.id,
                [Op.or]: [
                    { fecha_caducidad: null },
                    { fecha_caducidad: '' }
                ]
            }
        });

        res.status(200).json({
            total,
            caducados,
            porVencer,
            frescos,
            seguros: total - caducados - porVencer - frescos
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener estadísticas", error: error.message });
    }
};

// Obtener alertas de vencimiento
exports.getAlerts = async (req, res) => {
    try {
        const hoy = new Date();
        const limiteAlerta = new Date();
        limiteAlerta.setDate(hoy.getDate() + 7);

        const alertas = await Producto.findAll({
            where: {
                usuario_id: req.user.id,
                fecha_caducidad: { [Op.lte]: limiteAlerta }
            },
            order: [['fecha_caducidad', 'ASC']],
            limit: 5
        });

        res.status(200).json(alertas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener alertas", error: error.message });
    }
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            usuario_id: req.user.id,
            fecha_entrada: req.body.fecha_entrada || new Date().toISOString().split('T')[0],
            fecha_caducidad: req.body.fecha_caducidad && req.body.fecha_caducidad.trim() !== '' ? req.body.fecha_caducidad : null
        };
        const newProduct = await Producto.create(payload);

        const fullProduct = await Producto.findByPk(newProduct.id, {
            include: [{ model: Categoria, as: 'Categoria', attributes: ['nombre', 'icono'] }]
        });

        res.status(201).json(fullProduct);
    } catch (error) {
        res.status(400).json({ message: "Error al crear producto", error: error.message });
    }
};

// Obtener UN solo producto por su ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Producto.findOne({
            where: { id: req.params.id, usuario_id: req.user.id },
            include: [{ model: Categoria, as: 'Categoria', attributes: ['nombre', 'icono'] }]
        });
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener producto", error: error.message });
    }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.fecha_caducidad === '') data.fecha_caducidad = null;

        const [updatedRows] = await Producto.update(data, {
            where: { id: req.params.id, usuario_id: req.user.id }
        });
        
        if (updatedRows === 0) return res.status(404).json({ message: "No se encontró el producto para actualizar" });
        
        const updatedProduct = await Producto.findByPk(req.params.id, {
            include: [{ model: Categoria, as: 'Categoria', attributes: ['nombre', 'icono'] }]
        });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar", error: error.message });
    }
};


// ... (other exports)

// ... (other exports)

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    const impactController = require('./impactController');
    try {
        const product = await Producto.findOne({ 
            where: { id: req.params.id, usuario_id: req.user.id } 
        });

        if (!product) return res.status(404).json({ message: "Producto no encontrado o no tienes permiso" });

        // Si el producto se elimina antes de vencer, registrar como ahorro ecológico
        const hoy = new Date();
        const estaVencido = product.fecha_caducidad && new Date(product.fecha_caducidad) < hoy;
        
        if (!estaVencido) {
            await impactController.registerSavingAction(req.user.id, product.nombre, product.cantidad);
        }

        await product.destroy();
        res.status(200).json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar", error: error.message });
    }
};