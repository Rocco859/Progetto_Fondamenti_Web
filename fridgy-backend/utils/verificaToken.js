const jwt = require('jsonwebtoken');
const User = require('../models/User');
const httpStatus = require('http-status-codes');

async function verificaTokenEUtente(token) {
    // jwt.verify lancia un'eccezione sincrona se il token non è valido
    // o è scaduto (errori chiamati "JsonWebTokenError" o "TokenExpiredError").
    // Non serve try/catch qui, lasciamo che l'eccezione salga a chi ha
    // chiamato questa funzione (uno tra authMiddleware.js o socket.js)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //verifica che l'utente sia ancora presente nel db
    const user = await User.findById(decoded.id);

    if (!user) {
        const error = new Error("Utente non trovato");
        error.tipo = "UTENTE_NON_TROVATO";
        throw error;
    }

    return user;
}

module.exports = { verificaTokenEUtente };