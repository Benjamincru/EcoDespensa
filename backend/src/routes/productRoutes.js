const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/authMiddleware'); // Importamos el guardia

// Aplicamos 'auth' a todas las rutas de productos
router.get('/', auth, productController.getProducts);    
router.get('/stats', auth, productController.getStats);
router.get('/alerts', auth, productController.getAlerts);
router.post('/', auth, productController.createProduct); 
router.get('/:id', auth, productController.getProductById);   
router.put('/:id', auth, productController.updateProduct);    
router.delete('/:id', auth, productController.deleteProduct); 

module.exports = router;