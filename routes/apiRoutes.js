const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apiController');
const setoranController = require('../controllers/setoranController'); 
const authController = require('../controllers/authController'); 
const authMiddleware = require('../middleware/authMiddleware');
const exchangeRoutes = require('./exchange');
const laporanRoutes = require('./laporan');



router.get('/auth/me', authMiddleware, authController.getProfile);




router.put('/update-fcm-token', authMiddleware, authController.updateFCMToken);


router.get('/data', ApiController.getData);
router.post('/data', ApiController.postData);
router.post('/edukasi', authMiddleware, ApiController.postData);
router.get('/edukasi', ApiController.getData); 
router.put('/edukasi/:id', authMiddleware, ApiController.updateData); 
router.delete('/edukasi/:id', authMiddleware, ApiController.deleteData);


router.post('/setoran', authMiddleware, setoranController.createSetoran); 
router.get('/setoran', authMiddleware, setoranController.listSetoran);
router.delete('/setoran/:id', authMiddleware, setoranController.deleteSetoran);



router.put('/setoran/status/:id', authMiddleware, setoranController.updateStatus);


router.use('/laporan', laporanRoutes); 
router.use('/reward', exchangeRoutes); 
router.use('/exchange', exchangeRoutes);

module.exports = router;