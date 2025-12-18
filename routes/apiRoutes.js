const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apiController');
const authMiddleware = require('../middleware/authMiddleware'); // Pastikan middleware ini di-import

// --- ENDPOINT EDUKASI ---
router.get('/data', ApiController.getData);
router.post('/data', ApiController.postData);

// PERBAIKAN: Menggunakan ApiController.postData (karena createEdukasi tidak ada di Controller)
router.post('/edukasi', authMiddleware, ApiController.postData);

// Endpoint untuk mengambil list berita
router.get('/edukasi', authMiddleware, ApiController.getData);

// --- ROUTE LAINNYA (TETAP DIJAGA) ---
const laporanRoutes = require('./laporan');
const exchangeRoutes = require('./exchange');

// --- PENAMBAHAN OLEH Naufal ---
router.use('/laporan', laporanRoutes); // Endpoint: /api/laporan/...
router.use('/reward', exchangeRoutes); // Endpoint: /api/reward/exchange
// -----------------------------

module.exports = router;