require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
const http = require('http');

const{ configuraSocket } = require('./socket');

const authRoutes = require('./routes/AuthRoutes');
const alimentiRoutes = require('./routes/AlimentiRoutes');
const gestioneAlimentoRoutes = require('./routes/GestioneAlimentoRoutes');
const spesaRoutes = require('./routes/SpesaRoutes');
const chatbotRoutes = require('./routes/ChatbotRoutes');



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

app.use('/api', authRoutes);
app.use('/api', alimentiRoutes);
app.use('/api/frigo', gestioneAlimentoRoutes);
app.use('/api/spesa', spesaRoutes);
app.use('/api/chatbot', chatbotRoutes);


const server = http.createServer(app);

configuraSocket(server);

// 5. ACCENSIONE (L'ascolto sulla porta)

server.listen(PORT, () => {
console.log(` Server acceso sulla porta ${PORT}`);
});