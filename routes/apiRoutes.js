const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apiController');
const setoranController = require('../controllers/setoranController'); 
const authMiddleware = require('../middleware/authMiddleware');

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

// --- IMPORT ROUTE MODUL LAIN ---
const laporanRoutes = require('./laporan');
const exchangeRoutes = require('./exchange');

// --- PENGGUNAAN MODUL (Clean Architecture) ---
router.use('/laporan', laporanRoutes); // Semua rute /api/laporan/... ada di file laporan.js
router.use('/reward', exchangeRoutes); 

module.exports = router;