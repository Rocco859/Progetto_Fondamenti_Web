const express = require('express');
const router = express.Router();
const alimentiController = require('../controllers/ControllerAlimenti');
const { verifyJWT } = require('../middlewares/authMiddleware');

router.get('/alimenti-scadenza', verifyJWT, alimentiController.getAlimentoScadenza);

module.exports = router;