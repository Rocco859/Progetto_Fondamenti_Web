// ASSICURATI CHE QUESTA SIA LA PRIMA RIGA IN ASSOLUTO!
require('dotenv').config(); 

const authController = require('./controllers/ControllerAuth');
const User = require('./models/User');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
const chatbotRoutes = require('./routes/ChatbotRoutes');
const alimentiController = require('./controllers/ControllerAlimenti');
const controllerGestioneAlimento = require('./controllers/ControllerGestioneAlimento');
const controllerSpesa = require('./controllers/ControllerSpesa');

const app = express();

app.use(cors());
app.use(express.json());

// RADAR GLOBALE   DA RIMUOVERE UNA VOLTA RISOLTO IL PROBLEMA DELLA CHAT
app.use((req, res, next) => {
    console.log(`📡 RADAR: Qualcuno ha bussato a -> ${req.method} ${req.url}`);
    next();
});



// =================================================================
// ECCO DOVE DEVI SCRIVERE LA STRINGA DEL DETECTIVE:
console.log("🔍 Controllo la variabile:", process.env.MONGO_URI);

// E SUBITO SOTTO LASCI LA TUA CONNESSIONE:
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🟢 Fantastico! Ci siamo connessi a MongoDB Atlas!'))
    .catch((err) => console.error('🔴 Alt! Qualcosa è andato storto con il DB:', err));
// =================================================================

// 4. LE ROTTE (Le strade dell'API)
app.get('/', (req, res) => {
    res.send("Il server risponde correttamente!");
});
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
app.get('/api/alimenti-scadenza', alimentiController.getAlimentoScadenza);
// app.use('/api/chatbot', chatbotRoutes);
app.post('/api/frigo/aggiungi', controllerGestioneAlimento.registraAlimento)
app.get('/api/frigo', controllerGestioneAlimento.getAlimentiUtente);
app.delete('/api/frigo/:id', controllerGestioneAlimento.rimuoviAlimento);
app.get('/api/spesa', controllerSpesa.getListaSpesa);
app.post('/api/spesa/aggiungi', controllerSpesa.aggiungiSpesa);
app.delete('/api/spesa/:id', controllerSpesa.rimuoviSpesa);

// 5. ACCENSIONE (L'ascolto sulla porta)
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server acceso sulla porta ${PORT}`);
});