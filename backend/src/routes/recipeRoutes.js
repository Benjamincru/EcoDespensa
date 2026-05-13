const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/authMiddleware');

router.get('/suggested', auth, recipeController.getSuggestedRecipes);

module.exports = router;
