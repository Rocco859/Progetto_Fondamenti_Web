const jwt = require('jsonwebtoken');
const User = require('../models/User');
const httpStatus = require('http-status-codes');

async function verificaTokenEUtente(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);//verifica che l'utente sia ancora presente nel db

    if (!user) {
        const error = new Error("Utente non trovato");
        error.tipo = "UTENTE_NON_TROVATO";
        throw error;
    }

    return user;
}

module.exports = { verificaTokenEUtente };