const Spesa = require('../models/Spesa');
const jwt = require('jsonwebtoken');

exports.getListaSpesa = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Utente non autorizzato." });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; 

        const lista = await Spesa.find({ utente: userId });
        res.status(200).json({ success: true, lista });
    } catch (error) {
        console.error("Errore nel recupero della lista della spesa:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.aggiungiSpesa = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Utente non autorizzato." });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; 

        const { nomeAlimento } = req.body;
        
        if (!nomeAlimento) {
            return res.status(400).json({ success: false, message: "Il nome dell'alimento è obbligatorio." });
        }

        const nuovoElemento = new Spesa({ nome: nomeAlimento, utente: userId });
        await nuovoElemento.save();
        
        res.status(201).json({ success: true, elemento: nuovoElemento });
    } catch (error) {
        console.error("Errore nell'aggiunta alla lista della spesa:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.rimuoviSpesa = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Utente non autorizzato." });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const idElemento = req.params.id;

        const elementoRimosso = await Spesa.findOneAndDelete({ _id: idElemento, utente: userId });
        if (!elementoRimosso) {
            return res.status(404).json({ success: false, message: "Alimento non trovato." });
        }
        res.status(200).json({ success: true, message: "Alimento rimosso dalla lista." });
    } catch (error) {
        console.error("Errore nell'eliminazione dalla lista della spesa:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
