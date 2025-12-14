const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apiController');

router.get('/data', ApiController.getData);
router.post('/data', ApiController.postData);

const laporanRoutes = require('./laporan');
const exchangeRoutes = require('./exchange');


router.use('/auth', authRoutes);
router.use('/sampah', sampahRoutes);
routerrouter.use('/bins', binRoutes);

// --- PENAMBAHAN OLEH Naufal ---
router.use('/laporan', laporanRoutes); // Endpoint: /api/laporan/...
router.use('/reward', exchangeRoutes); // Endpoint: /api/reward/exchange
// -----------------------------

module.exports = router;