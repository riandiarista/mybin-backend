const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apiController');

router.get('/data', ApiController.getData);
router.post('/data', ApiController.postData);

module.exports = router;