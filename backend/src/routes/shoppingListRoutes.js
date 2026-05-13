const express = require('express');
const router = express.Router();
const listController = require('../controllers/shoppingListController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, listController.getShoppingList);
router.post('/sync', auth, listController.syncAutoList);
router.post('/', auth, listController.addItem);
router.put('/:id/toggle', auth, listController.toggleBought);
router.delete('/:id', auth, listController.deleteItem);

module.exports = router;
