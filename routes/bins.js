const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// PENTING: Import dari 'sampahController', BUKAN 'binController'
const ctrl = require('../controllers/sampahController');

// Debugging: Pastikan fungsi terbaca (Optional, bisa dihapus nanti)
// console.log('List Func:', ctrl.listSampah); 

// Definisikan Route
// Pastikan nama fungsi sama persis dengan yang ada di sampahController.js
router.get('/', auth, ctrl.listSampah);       // GET /api/bins
router.post('/', auth, ctrl.createSampah);    // POST /api/bins
router.get('/:id', auth, ctrl.getSampahById); // GET /api/bins/:id
router.put('/:id', auth, ctrl.updateSampah);  // PUT /api/bins/:id
router.delete('/:id', auth, ctrl.deleteSampah); // DELETE /api/bins/:id

module.exports = router;