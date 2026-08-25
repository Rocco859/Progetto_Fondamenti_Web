const express = require('express');
const router = express.Router();
const ControllerHealth = require('../controllers/ControllerHealth');

router.get('/', ControllerHealth.healthCheck);

module.exports = router;