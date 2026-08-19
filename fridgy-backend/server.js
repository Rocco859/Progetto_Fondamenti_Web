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

// AGGIUNTO: import del middleware di autenticazione JWT creato in precedenza
const { verifyJWT } = require('./middlewares/authMiddleware');

const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { initIO } = require('./socket');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


//connessione al db
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🟢 Fantastico! Ci siamo connessi a MongoDB Atlas!'))
    .catch((err) => console.error('🔴 Alt! Qualcosa è andato storto con il DB:', err));


// 4. LE ROTTE (Le strade dell'API)
app.get('/', (req, res) => {
res.send("Il server risponde correttamente!");
});

// Route pubbliche: NON serve autenticazione (registrazione e login)
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

// AGGIUNTO "verifyJWT" come secondo parametro: ora la route è protetta,
// il middleware verifica il token PRIMA di far eseguire il controller
app.get('/api/alimenti-scadenza', verifyJWT, alimentiController.getAlimentoScadenza);

app.use('/api/chatbot', chatbotRoutes);

// AGGIUNTO "verifyJWT" su tutte le route del frigo: dati specifici dell'utente,
// senza autenticazione chiunque potrebbe leggere/modificare il frigo di altri
app.post('/api/frigo/aggiungi', verifyJWT, controllerGestioneAlimento.registraAlimento);
app.get('/api/frigo', verifyJWT, controllerGestioneAlimento.getAlimentiUtente);
app.delete('/api/frigo/:id', verifyJWT, controllerGestioneAlimento.rimuoviAlimento);

// AGGIUNTO "verifyJWT" sulla stessa logica per la lista della spesa
app.get('/api/spesa', verifyJWT, controllerSpesa.getListaSpesa);
app.post('/api/spesa/aggiungi', verifyJWT, controllerSpesa.aggiungiSpesa);
app.delete('/api/spesa/:id', verifyJWT, controllerSpesa.rimuoviSpesa);


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"// ATTENZIONE: da restringere all'URL del frontend prima del deploy in produzione
    }
})

// 5. ACCENSIONE (L'ascolto sulla porta)

app.listen(PORT, () => {
console.log(`🚀 Server acceso sulla porta ${PORT}`);
});