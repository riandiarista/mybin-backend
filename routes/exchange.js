const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');
const authMiddleware = require('../middleware/authMiddleware');



router.post('/', authMiddleware, exchangeController.createExchange);

module.exports = router;