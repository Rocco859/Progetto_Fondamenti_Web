require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
const http = require('http');

// Import della configurazione Socket.io — è questa riga che, insieme
// alla chiamata configuraSocket(server) più sotto, fa partire il real-time
const { configuraSocket } = require('./socket');

// Import dei moduli di rotte: server.js non conosce più i singoli
// controller, ogni gruppo di endpoint vive nel proprio file
const authRoutes = require('./routes/AuthRoutes');
const alimentiRoutes = require('./routes/AlimentiRoutes');
const gestioneAlimentoRoutes = require('./routes/GestioneAlimentoRoutes');
const spesaRoutes = require('./routes/SpesaRoutes');
const chatbotRoutes = require('./routes/ChatbotRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());


//connessione al db
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🟢 Fantastico! Ci siamo connessi a MongoDB Atlas!'))
    .catch((err) => console.error('🔴 Alt! Qualcosa è andato storto con il DB:', err));


// 4. LE ROTTE (Le strade dell'API)
app.get('/', (req, res) => {
    res.send("Il server risponde correttamente!");
});

// Ogni app.use monta un intero gruppo di rotte sotto il prefisso indicato.
// Il middleware verifyJWT è applicato dentro i singoli file di rotte.
app.use('/api', authRoutes);
app.use('/api', alimentiRoutes);
app.use('/api/frigo', gestioneAlimentoRoutes);
app.use('/api/spesa', spesaRoutes);
app.use('/api/chatbot', chatbotRoutes);


// Creiamo il server HTTP esplicito, necessario perché Socket.io
// possa agganciarsi alla stessa porta di Express
const server = http.createServer(app);

// Attiva Socket.io: senza questa riga il real-time non parte,
// anche se socket.js è scritto correttamente
configuraSocket(server);

// 5. ACCENSIONE (L'ascolto sulla porta)
// Attenzione: server.listen, NON app.listen — altrimenti Socket.io
// resterebbe agganciato a un server che non ascolta nessuna richiesta
server.listen(PORT, () => {
    console.log(`🚀 Server acceso sulla porta ${PORT}`);
});