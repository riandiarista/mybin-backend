
const express = require('express');
const router = express.Router();

const laporanController = require('../controllers/laporanController');
const authMiddleware = require('../middleware/authMiddleware');



router.get('/history', authMiddleware, laporanController.getLaporanUser);

module.exports = router;