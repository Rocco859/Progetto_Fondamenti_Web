const Alimento = require('../models/Alimento');
const jwt = require('jsonwebtoken');

exports.registraAlimento = async (req, res) => {
    try {
        // 1. Controlla e decodifica il token per capire chi è l'utente
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Utente non autorizzato. Fai il login." });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Recuperiamo l'ID dell'utente dal token

        // 2. Prendi i dati dall'input frontend
        const { nomeAlimento, scadenzaAlimento, quantitaAlimento } = req.body;
        
        // 3. Crea il nuovo alimento passando anche l'ID utente (presumendo che il tuo modello Alimento abbia il campo 'utente')
        const nuovoAlimento = new Alimento({ nome: nomeAlimento, dataScadenza: scadenzaAlimento, quantita: quantitaAlimento, utente: userId });
        await nuovoAlimento.save();
        
        res.status(201).json({ success: true, message: "Alimento registrato con successo!" });
    } catch (error) {
        console.error("Errore nella registrazione dell'alimento:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}
