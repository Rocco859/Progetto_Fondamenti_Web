const mongoose = require('mongoose');

const alimentoSchema = mongoose.Schema({
    nome: {
        type: String,
        required: [true, "Il nome dell'alimento è obbligatorio"]
    },
    giorniRimanenti: {
        type: Date,
        required: [true, "I giorni rimanenti sono obbligatori"], /*da valutare come implementare*/
    
    },

});

module.exports = mongoose.model("Alimento", alimentoSchema);