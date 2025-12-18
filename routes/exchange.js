// routes/exchange.js
const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');
const authMiddleware = require('../middleware/authMiddleware');

// PERBAIKAN: Gunakan authMiddleware secara langsung karena ia diekspor sebagai fungsi tunggal
router.use(authMiddleware);

// POST /api/reward/exchange
// Pastikan nama fungsi di exchangeController.js adalah exchangePoin
router.post('/exchange', exchangeController.exchangePoin); 

module.exports = router;