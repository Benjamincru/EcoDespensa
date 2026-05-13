const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, categoriaController.getCategorias);
router.post('/', auth, categoriaController.createCategoria);

module.exports = router;
