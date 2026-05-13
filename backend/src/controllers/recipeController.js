const { Producto } = require('../models');
const { Op } = require('sequelize');

exports.getSuggestedRecipes = async (req, res) => {
    try {
        // Encontrar productos que vencen pronto para basar las recetas en ellos
        const productosVencimiento = await Producto.findAll({
            where: { 
                usuario_id: req.user.id,
                fecha_caducidad: { [Op.ne]: null }
            },
            order: [['fecha_caducidad', 'ASC']],
            limit: 3
        });

        const ingredientesBase = productosVencimiento.map(p => p.nombre).join(', ') || 'tus productos básicos';

        // Recetas precargadas (Simulando respuesta de IA)
        const recetas = [
            {
                id: 1,
                nombre: "Salteado Eco-Rápido",
                dificultad: "Fácil",
                tiempo: "15 min",
                ecoScore: 98,
                imagen: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
                descripcion: `Aprovecha perfectamente tu ${productosVencimiento[0]?.nombre || 'vegetal'} y otros básicos.`,
                ingredientes: ["Aceite de oliva", "Ajo", ingredientesBase]
            },
            {
                id: 2,
                nombre: "Bowl de Proteína y Vegetales",
                dificultad: "Media",
                tiempo: "25 min",
                ecoScore: 92,
                imagen: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
                descripcion: "Una mezcla nutritiva para usar esos productos frescos antes de que pierdan su brillo.",
                ingredientes: ["Arroz o Quinoa", "Especias", "Tus productos frescos"]
            },
            {
                id: 3,
                nombre: "Sopa de la Casa Eco",
                dificultad: "Fácil",
                tiempo: "40 min",
                ecoScore: 100,
                imagen: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400",
                descripcion: "La mejor forma de no desperdiciar nada. Todo al caldo.",
                ingredientes: ["Caldo de pollo/verdura", "Hierbas frescas", "Productos variados"]
            }
        ];

        res.status(200).json(recetas);
    } catch (error) {
        res.status(500).json({ message: "Error al generar recetas", error: error.message });
    }
};
