// ASSICURATI CHE QUESTA SIA LA PRIMA RIGA IN ASSOLUTO!
require('dotenv').config(); 

const authController = require('./controllers/ControllerAuth');
const User = require('./models/User');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
const alimentiController = require('./controllers/ControllerAlimenti');

const app = express();

app.use(cors());
app.use(express.json());

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

// 5. ACCENSIONE (L'ascolto sulla porta)
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server acceso sulla porta ${PORT}`);
});