// routes/laporan.js
const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.use(authMiddleware.protect); // Semua route laporan harus dilindungi (asumsi authMiddleware ada)

// GET /api/laporan/saldo-poin
router.get('/saldo-poin', laporanController.getSaldoPoin);

// GET /api/laporan/riwayat-setoran
router.get('/riwayat-setoran', laporanController.getRiwayatSetoran);

// GET /api/laporan/riwayat-exchange
router.get('/riwayat-exchange', laporanController.getRiwayatExchange);

// Endpoint untuk Export (akan diimplementasikan di langkah selanjutnya)
// router.get('/export', laporanController.exportLaporan); 

module.exports = router;