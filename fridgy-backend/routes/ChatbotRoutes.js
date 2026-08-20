const express = require("express");
const router = express.Router();
const ControllerChatbot = require("../controllers/ControllerChatbot");

const { verifyJWT } = require("../middlewares/authMiddleware");

router.post('/messaggio', verifyJWT, ControllerChatbot.inviaMessaggio);

module.exports = router;