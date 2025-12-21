const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint: POST /api/exchange/
// User mengirim: { "amount_poin": 1000, "phone_number": "0812..." }
router.post('/', authMiddleware, exchangeController.createExchange);

module.exports = router;