const mongoose = require('mongoose');

// 1. Creiamo lo "stampo" (Schema)
const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    codiceFiscale: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    frigo: { type: Array, default: [] }
}, { timestamps: true });

// 2. Esportiamo il modello per poterlo usare in server.js
module.exports = mongoose.model('User', userSchema);