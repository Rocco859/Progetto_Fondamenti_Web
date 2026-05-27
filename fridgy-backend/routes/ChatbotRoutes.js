const express = require('express');
const router = express.Router();
const ControllerChatbot = require('../controllers/ControllerChatbot');

router.proppatch('/messaggio', ControllerChatbot.inviaMessaggio);

module.exports = router;
