const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        // Hash the password directly before creating
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await Usuario.create({ nombre, email, password: hashedPassword });
        
        res.status(201).json({ message: "Usuario creado con éxito", user: { id: user.id, nombre: user.nombre } });
    } catch (error) {
        console.log("LOG DEL ERROR EN TERMINAL:", error); 
        res.status(400).json({ 
            message: "Error al registrar usuario", 
            error: error.message 
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Usuario.findOne({ where: { email } });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Generamos el Token (Dura 7 días)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, nombre: user.nombre } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};