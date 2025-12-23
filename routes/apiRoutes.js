const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apiController');
const setoranController = require('../controllers/setoranController'); 
const authController = require('../controllers/authController'); 
const authMiddleware = require('../middleware/authMiddleware');
const exchangeRoutes = require('./exchange');
const laporanRoutes = require('./laporan');

// --- ENDPOINT AUTH & PROFILE ---
// Jalur: GET /api/auth/me
router.get('/auth/me', authMiddleware, authController.getProfile);

// --- ENDPOINT EDUKASI ---
router.get('/data', ApiController.getData);
router.post('/data', ApiController.postData);
router.post('/edukasi', authMiddleware, ApiController.postData);
router.get('/edukasi', ApiController.getData); 
router.put('/edukasi/:id', authMiddleware, ApiController.updateData); 
router.delete('/edukasi/:id', authMiddleware, ApiController.deleteData);

// --- ENDPOINT SETORAN ---
router.post('/setoran', authMiddleware, setoranController.createSetoran); 
router.get('/setoran', authMiddleware, setoranController.listSetoran);
router.delete('/setoran/:id', authMiddleware, setoranController.deleteSetoran);

// PERUBAHAN KRUSIAL: Menambahkan rute PUT untuk update status (Verifikasi/Tolak)
// Jalur: PUT /api/setoran/status/:id
router.put('/setoran/status/:id', authMiddleware, setoranController.updateStatus);

// --- PENGGUNAAN MODUL (Clean Architecture) ---
router.use('/laporan', laporanRoutes); 
router.use('/reward', exchangeRoutes); 
router.use('/exchange', exchangeRoutes);

module.exports = router;