const mongoose = require('mongoose');

const ConversazioneSchema = new mongoose.Schema(
    {
        mittente: {
            type: String,
            enum: ['utente', 'ai'],

            required: true
        },

        testo: {
            type: String,
            required: true,

        },
        
        utente:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null  /*se l'utente non è loggato*/


        }
    },
    {
        timestamps: true,
    }

);

module.exports = mongose.model('Conversazione',ConversazioneSchema);