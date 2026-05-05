const { Producto } = require('../models');

// Obtener todos los productos
exports.getProducts = async (req, res) => {
    try {
        const products = await Producto.findAll({ where: { usuario_id: req.user.id } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error: error.message });
    }
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
    try {
        const newProduct = await Producto.create({
            ...req.body,
            usuario_id: req.user.id 
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: "Error al crear producto", error: error.message });
    }
};

// Obtener UN solo producto por su ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Producto.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el producto", error: error.message });
    }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
    try {
        const [updatedRows] = await Producto.update(req.body, {
            where: { id: req.params.id }
        });
        
        if (updatedRows === 0) return res.status(404).json({ message: "No se encontró el producto para actualizar" });
        
        const updatedProduct = await Producto.findByPk(req.params.id);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar", error: error.message });
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    try {
        const deletedRows = await Producto.destroy({ 
            where: { id: req.params.id, usuario_id: req.user.id } 
        });
        
        if (deletedRows === 0) return res.status(404).json({ message: "Producto no encontrado o no tienes permiso" });
        res.status(200).json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar", error: error.message });
    }
};