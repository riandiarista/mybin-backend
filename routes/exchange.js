// routes/exchange.js
const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect); // Route exchange harus dilindungi

// POST /api/reward/exchange
router.post('/exchange', exchangeController.exchangePoin); 

module.exports = router;