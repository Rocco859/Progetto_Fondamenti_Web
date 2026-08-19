const express = require('express');
const router = express.Router();
const controllerSpesa = require('../controllers/ControllerSpesa');
const { verifyJWT } = require('../middlewares/authMiddleware');

router.get('/', verifyJWT, controllerSpesa.getListaSpesa);
router.post('/aggiungi', verifyJWT, controllerSpesa.aggiungiSpesa);
router.delete('/:id', verifyJWT, controllerSpesa.rimuoviSpesa);

module.exports = router;