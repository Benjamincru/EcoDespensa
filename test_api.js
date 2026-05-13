const { Producto, Categoria } = require('./backend/src/models');

async function test() {
  try {
    const products = await Producto.findAll({ 
      include: [{ model: Categoria, attributes: ['nombre', 'icono'] }]
    });
    console.log('--- PRODUCTS WITH CATEGORIA ---');
    products.forEach(p => {
      console.log(`${p.nombre}: ${p.Categoria ? p.Categoria.nombre : 'NULL'} (ID: ${p.categoria_id})`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

test();
