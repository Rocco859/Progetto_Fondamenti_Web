// ASSICURATI CHE QUESTA SIA LA PRIMA RIGA IN ASSOLUTO!
require('dotenv').config(); 

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

// ... qui sotto prosegue con app.get e app.listen ...

// 4. LE ROTTE (Le strade dell'API)
app.get('/', (req, res) => {
    res.send("Il server risponde correttamente!");
});
app.post('/api/register', async (req, res) => {
    try {
        // 1. Prendiamo i dati che l'utente ha scritto nel form (arriveranno da React)
        const { nome, cognome, codiceFiscale, email, password } = req.body;

        // 2. Creiamo un nuovo utente usando lo stampo (Modello) di Mongoose
        const nuovoUtente = new User({
            nome,
            cognome,
            codiceFiscale,
            email,
            password // Nota: per l'esame la computeremo in modo sicuro più avanti!
        });

        // 3. Salviamo l'utente nel database su Atlas
        await nuovoUtente.save();

        // 4. Rispondiamo a React dicendo che è andato tutto bene
        res.status(201).json({ 
            success: true, 
            message: "🎉 Utente registrato con successo!", 
            utente: nuovoUtente 
        });
} catch (error) {
        console.error("🔴 Errore nel salvataggio su Atlas:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


app.get('/api/alimenti-scadenza', alimentiController.getAlimentoScadenza);

// 5. ACCENSIONE (L'ascolto sulla porta)
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server acceso sulla porta ${PORT}`);
});