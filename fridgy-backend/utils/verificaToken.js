const jwt = require('jsonwebtoken');
const User = require('../models/User');
const httpStatus = require('http-status-codes');

async function verificaTokenEUtente(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // jwt.verify lancia un'eccezione sincrona se il token non è valido
    // o è scaduto(Errori "JsonWebTokenError" o "TokenExpiredError"), non si usa try catch, l'eccezione sale fino a chi ha chaiamato la funzione

    
    const user = await User.findById(decoded.id);//verifica che l'utente sia ancora presente nel db

    if (!user) {
        const error = new Error("Utente non trovato");
        error.tipo = "UTENTE_NON_TROVATO";
        throw error;
    }

    return user;
}

module.exports = { verificaTokenEUtente };