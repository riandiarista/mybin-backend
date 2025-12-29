const express = require('express');
const router = express.Router();


const ctrl = require('../controllers/sampahController'); 
const auth = require('../middleware/authMiddleware');





router.get('/', auth, ctrl.listSampah);       
router.post('/', auth, ctrl.createSampah);    


router.get('/:id', auth, ctrl.getSampahById); 
router.put('/:id', auth, ctrl.updateSampah);  
router.delete('/:id', auth, ctrl.deleteSampah); 

module.exports = router;