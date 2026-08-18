const express = require('express');
const router = express.Router();
const ControllerChatbot = require('../controllers/ControllerChatbot');

console.log("File ChatbotRoutes caricato con successo")

// 1. ROTTA DI TEST (Per vedere se il browser ci arriva)  DA CANCELLARE, SERIVVA SOLO PER CATTURARE LERRORE DELLA CHAT
router.get('/test', (req, res) => {
    res.send("Il ponte del Chatbot è aperto e funzionante! 🌉");
});

// 2. LA VERA ROTTA CON L'ALLARME. DA CANCELLARE, SERIVVA SOLO PER CATTURARE LERRORE DELLA CHAT
router.post('/messaggio', (req, res) => {
    console.log("🔔 DING DONG! È appena arrivato un messaggio da React!");
     console.log("Body ricevuto:", req.body);
    // Passiamo la palla al controller vero e proprio
    ControllerChatbot.inviaMessaggio(req, res);
});

/*router.post('/messaggio', ControllerChatbot.inviaMessaggio); */  /*DA RIMUOVERE IL COMMENTO E ASCIARE LIBERA LA STRINGA UNA VOLTA TROVATO L'ERRORE*/

module.exports = router;
