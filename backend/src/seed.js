const { Categoria } = require('./models');

async function checkAndSeed() {
    try {
        const categoriesToSeed = [
            { nombre: 'Abarrotes', icono: 'Package' },
            { nombre: 'Lácteos', icono: 'Milk' },
            { nombre: 'Frutas y Verduras', icono: 'Apple' },
            { nombre: 'Carnes', icono: 'Beef' },
            { nombre: 'Bebidas', icono: 'Coffee' },
            { nombre: 'Limpieza', icono: 'Archive' },
            { nombre: 'Productos Frescos', icono: 'Leaf' },
            { nombre: 'General', icono: 'HelpCircle' }
        ];

        for (const cat of categoriesToSeed) {
            const [record, created] = await Categoria.findOrCreate({
                where: { nombre: cat.nombre },
                defaults: { icono: cat.icono }
            });
            if (created) {
                console.log(`Categoría creada: ${cat.nombre}`);
            }
        }
        
    } catch (e) {
        console.error("Error al verificar/sembrar:", e);
    }
}

module.exports = checkAndSeed;
