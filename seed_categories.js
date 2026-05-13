const { Categoria } = require('./backend/src/models');

async function seed() {
    try {
        await Categoria.bulkCreate([
            { nombre: 'Lácteos', icono: 'Milk' },
            { nombre: 'Frutas y Verduras', icono: 'Apple' },
            { nombre: 'Cárnicos', icono: 'Beef' },
            { nombre: 'Abarrotes', icono: 'Package' },
            { nombre: 'Bebidas', icono: 'Coffee' },
            { nombre: 'Otros', icono: 'HelpCircle' }
        ], { ignoreDuplicates: true });
        console.log('Categorías sembradas');
    } catch (e) {
        console.error(e);
    }
    process.exit();
}

seed();
