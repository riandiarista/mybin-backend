const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apiController');
const setoranController = require('../controllers/setoranController'); // IMPORT CONTROLLER BARU
const authMiddleware = require('../middleware/authMiddleware'); //

// --- ENDPOINT EDUKASI ---
// Mengizinkan pengambilan data tanpa token (opsional) agar NewsScreen langsung tampil
router.get('/data', ApiController.getData);
router.post('/data', ApiController.postData);

// PERBAIKAN: Menggunakan ApiController.postData
// POST, PUT, dan DELETE tetap butuh login (authMiddleware) untuk keamanan
router.post('/edukasi', authMiddleware, ApiController.postData);

// CATATAN: authMiddleware dihapus dari GET /edukasi agar NewsScreen bisa fetch data dengan mudah
// Jika Anda ingin tetap diproteksi, biarkan authMiddleware terpasang.
router.get('/edukasi', ApiController.getData); 

// TAMBAHAN: Endpoint untuk Update dan Delete agar fitur Edit di BeritaAndaScreen berfungsi
router.put('/edukasi/:id', authMiddleware, ApiController.updateData); 
router.delete('/edukasi/:id', authMiddleware, ApiController.deleteData);

// --- ENDPOINT SETORAN (PERBAIKAN UNTUK ANDROID) ---
router.post('/setoran', authMiddleware, setoranController.createSetoran); 
router.get('/setoran', authMiddleware, setoranController.listSetoran);

// --- ROUTE LAINNYA (TETAP DIJAGA) ---
const laporanRoutes = require('./laporan');
const exchangeRoutes = require('./exchange');

// --- PENAMBAHAN OLEH Naufal ---
router.use('/laporan', laporanRoutes); // Endpoint: /api/laporan/...
router.use('/reward', exchangeRoutes); // Endpoint: /api/reward/exchange
// -----------------------------

module.exports = router;