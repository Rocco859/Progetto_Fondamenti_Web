require('dotenv').config();  //carica le variabili d'ambiente dal .env e le rende disponibili con process.env


//Import 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
const http = require('http');
const { configuraSocket } = require('./socket');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

//routes
const healthRoutes = require('./routes/HealthRoutes');
const authRoutes = require('./routes/AuthRoutes');
const alimentiRoutes = require('./routes/AlimentiRoutes');
const gestioneAlimentoRoutes = require('./routes/GestioneAlimentoRoutes');
const spesaRoutes = require('./routes/SpesaRoutes');
const chatbotRoutes = require('./routes/ChatbotRoutes');


//avvio dell'applicazione express
const app = express();
const PORT = process.env.PORT || 3000;


//Frontend
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());


//connessione al db
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connessi a MongoDB'))
    .catch((err) => console.error('Qualcosa è andato storto con il DB:', err));



//aggancia lo swagger all'indirizzo /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//rotta per il check del server
app.use('/health', healthRoutes);



//aggancia la rotta al percorso
app.use('/api/v1', authRoutes);
app.use('/api/v1', alimentiRoutes);
app.use('/api/v1/frigo', gestioneAlimentoRoutes);
app.use('/api/v1/spesa', spesaRoutes);
app.use('/api/v1/chatbot', chatbotRoutes);


//crea un server http usando l'app express
const server = http.createServer(app);

// Attiva Socket.io e lo aggancia al server
configuraSocket(server);

//avvio effettivo del server
server.listen(PORT, () => {
    console.log(`Server acceso sulla porta ${PORT}`);
});