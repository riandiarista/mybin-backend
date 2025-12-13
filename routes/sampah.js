const express = require('express');
const router = express.Router();

// 1. UBAH IMPORT: Panggil 'sampahController', BUKAN 'binController'
const ctrl = require('../controllers/sampahController'); 
const auth = require('../middleware/authMiddleware');

// 2. SESUAIKAN NAMA FUNGSI:
// Pastikan memanggil fungsi yang ada di dalam sampahController.js (listSampah & createSampah)
// BUKAN listBins atau createBin

router.get('/', auth, ctrl.listSampah);       // Mengambil daftar sampah
router.post('/', auth, ctrl.createSampah);    // Menambah data sampah baru

// Tambahkan route CRUD lainnya agar lengkap
router.get('/:id', auth, ctrl.getSampahById);
router.put('/:id', auth, ctrl.updateSampah);
router.delete('/:id', auth, ctrl.deleteSampah);

module.exports = router;