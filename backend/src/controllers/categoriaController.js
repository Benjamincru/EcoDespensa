const { Categoria } = require('../models');

exports.getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener categorías", error: error.message });
    }
};

exports.createCategoria = async (req, res) => {
    try {
        const newCategoria = await Categoria.create(req.body);
        res.status(201).json(newCategoria);
    } catch (error) {
        res.status(400).json({ message: "Error al crear categoría", error: error.message });
    }
};
