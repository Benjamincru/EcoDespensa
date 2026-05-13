require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const checkAndSeed = require('./seed');
// Conexión a SQLite con Sequelize
sequelize.sync()
  .then(() => {
     console.log("✅ Conectado a SQLite / Sincronizado");
     checkAndSeed();
  })
  .catch((err) => console.log("❌ Error de conexión:", err));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de EcoDespensa funcionando 🚀');
});
// Importar rutas
const productRoutes = require('./routes/productRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');

// Usar rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', productRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/impact', require('./routes/impactRoutes'));
app.use('/api/list', require('./routes/shoppingListRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
const errorHandler = require('./middleware/errorMiddleware');

// ... después de tus rutas ...
app.use(errorHandler);