const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/binController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, ctrl.listBins);
router.post('/', auth, ctrl.createBin);

module.exports = router;
