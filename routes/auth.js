const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Pastikan middleware ini di-import

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);

// TAMBAHKAN INI: Endpoint untuk menerima token FCM dari aplikasi Android
// Menggunakan authMiddleware agar server tahu ID user mana yang sedang mengupdate token
router.post('/update-fcm', authMiddleware, ctrl.updateFCMToken);

module.exports = router;