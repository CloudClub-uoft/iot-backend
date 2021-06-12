const express = require('express');
const router  = express.Router();
const deviceController = require('../controllers/device');

router.post('/register', deviceController.registerDevice);
router.get('/info', deviceController.deviceInfo);
router.post('/unregister', deviceController.unregisterDevice);

module.exports = router;