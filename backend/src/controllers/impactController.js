const { HistorialEco, Producto } = require('../models');

// Obtener el impacto ecológico y económico del usuario
exports.getImpactData = async (req, res) => {
    try {
        const registros = await HistorialEco.findAll({
            where: { usuario_id: req.user.id }
        });

        // Cálculos simples para demostración técnica
        // En una app real, estos valores vendrían de la base de datos de productos y sus pesos/precios
        const totalAhorrado = registros.reduce((acc, curr) => acc + (curr.cantidad * 15.5), 0); // $15.5 por producto promedio
        const co2Prevenido = registros.length * 0.5; // 0.5kg de CO2 por producto salvado
        const aguaSalvada = registros.length * 150; // 150 litros de agua por producto

        res.status(200).json({
            dineroAhorrado: totalAhorrado.toFixed(2),
            co2: co2Prevenido.toFixed(1),
            agua: aguaSalvada,
            puntosEco: registros.length * 10
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener impacto", error: error.message });
    }
};

// Registrar una acción de ahorro (Llamado internamente cuando se consume un producto antes de vencer)
exports.registerSavingAction = async (usuario_id, nombre, cantidad) => {
    try {
        await HistorialEco.create({
            usuario_id,
            nombre,
            accion: 'Ahorrado',
            cantidad
        });
    } catch (error) {
        console.error("Error al registrar acción eco:", error);
    }
};
