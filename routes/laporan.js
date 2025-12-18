const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const authMiddleware = require('../middleware/authMiddleware'); 

// PERBAIKAN: Gunakan authMiddleware langsung jika exports-nya adalah fungsi tunggal
// Jika di authMiddleware.js menggunakan module.exports = function..., maka jangan pakai .protect
router.use(authMiddleware); 

// GET /api/laporan/saldo-poin
router.get('/saldo-poin', laporanController.getSaldoPoin);

// GET /api/laporan/riwayat-setoran
router.get('/riwayat-setoran', laporanController.getRiwayatSetoran);

// GET /api/laporan/riwayat-exchange
router.get('/riwayat-exchange', laporanController.getRiwayatExchange);

module.exports = router;