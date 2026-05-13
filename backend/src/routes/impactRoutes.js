const express = require('express');
const router = express.Router();
const impactController = require('../controllers/impactController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, impactController.getImpactData);

module.exports = router;
