// routes/laporan.js
const express = require('express');
const router = express.Router();
// 1. Pastikan path file controller sudah benar (../controllers/laporanController)
const laporanController = require('../controllers/laporanController');
const authMiddleware = require('../middleware/authMiddleware');

// 2. Pastikan laporanController.getLaporanUser TIDAK bernilai undefined
// Periksa apakah nama fungsinya SAMA dengan yang ada di file controller
router.get('/history', authMiddleware, laporanController.getLaporanUser);

module.exports = router;