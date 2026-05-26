const mongoose = require('mongoose');

const alimentoSchema = mongoose.Schema({
    nome: {
        type: String,
        required: [true, "Il nome dell'alimento è obbligatorio"]
    },
    dataScadenza: {
        type: Date,
        required: [true, "La data di scadenza è obbligatoria"]
    },
    quantita: {
        type: Number,
        required: false,
        default: 1
    },
    utente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "L'utente proprietario è obbligatorio"]
    }
});

module.exports = mongoose.model("Alimento", alimentoSchema);