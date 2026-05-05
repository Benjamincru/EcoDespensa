require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Conexión a SQLite con Sequelize
sequelize.sync({ alter: true })
  .then(() => console.log("✅ Conectado a SQLite / Sincronizado"))
  .catch((err) => console.log("❌ Error de conexión:", err));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de EcoDespensa funcionando 🚀');
});
// Importar rutas
const productRoutes = require('./routes/productRoutes');

// Usar rutas
app.use('/api/products', productRoutes);
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
const errorHandler = require('./middleware/errorMiddleware');

// ... después de tus rutas ...
app.use(errorHandler);

app.use('/api/auth', require('./routes/authRoutes'));