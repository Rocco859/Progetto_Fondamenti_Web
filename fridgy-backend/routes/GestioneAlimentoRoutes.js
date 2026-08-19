const express = require('express');
const router = express.Router();
const controllerGestioneAlimento = require('../controllers/ControllerGestioneAlimento');
const { verifyJWT } = require('../middlewares/authMiddleware');

router.post('/aggiungi', verifyJWT, controllerGestioneAlimento.registraAlimento);
router.get('/', verifyJWT, controllerGestioneAlimento.getAlimentiUtente);
router.delete('/:id', verifyJWT, controllerGestioneAlimento.rimuoviAlimento);

module.exports = router;