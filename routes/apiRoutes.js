const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apiController');
const setoranController = require('../controllers/setoranController'); // IMPORT CONTROLLER BARU
const authMiddleware = require('../middleware/authMiddleware'); //

// --- ENDPOINT EDUKASI ---
router.get('/data', ApiController.getData);
router.post('/data', ApiController.postData);

// PERBAIKAN: Menggunakan ApiController.postData
router.post('/edukasi', authMiddleware, ApiController.postData);
router.get('/edukasi', authMiddleware, ApiController.getData);

// TAMBAHAN: Endpoint untuk Update dan Delete agar fitur Edit di BeritaAndaScreen berfungsi
router.put('/edukasi/:id', authMiddleware, ApiController.updateData); 
router.delete('/edukasi/:id', authMiddleware, ApiController.deleteData);

// --- ENDPOINT SETORAN (PERBAIKAN UNTUK ANDROID) ---
// Rute ini menangani pemindahan data dari AddAddressScreen.kt ke tabel setorans
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