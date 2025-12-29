const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);



router.post('/update-fcm', authMiddleware, ctrl.updateFCMToken);

module.exports = router;