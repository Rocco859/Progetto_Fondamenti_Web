const mongoose = require('mongoose');

const SpesaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    utente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Spesa', SpesaSchema);
