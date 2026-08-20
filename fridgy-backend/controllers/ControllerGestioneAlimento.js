const Alimento = require('../models/Alimento');
// RIMOSSO: "const jwt = require('jsonwebtoken');"
// Non serve più: la verifica del token è ora responsabilità del middleware
// verifyJWT, applicato in server.js prima di questi controller.

const { getIO } = require('../socket');

exports.registraAlimento = async (req, res) => {
  try {
    // RIMOSSO questo blocco, ora gestito dal middleware verifyJWT:
    //
    // const authHeader = req.headers.authorization;
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   return res.status(401).json({ success: false, message: "Utente non autorizzato. Fai il login." });
    // }
    // const token = authHeader.split(' ')[1];
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const userId = decoded.id;

    // MODIFICATO: userId ora arriva da req.userId, impostato dal middleware
    const userId = req.userId;

    // 2. Prendi i dati dall'input frontend
    const { nomeAlimento, scadenzaAlimento, quantitaAlimento } = req.body;

    // 3. Crea il nuovo alimento passando anche l'ID utente
    const nuovoAlimento = new Alimento({
      nome: nomeAlimento,
      dataScadenza: scadenzaAlimento,
      quantita: quantitaAlimento,
      utente: userId
    });
    await nuovoAlimento.save();

    getIO().to(userId.toString()).emit('frigo-aggiornato');

    res.status(201).json({ success: true, message: "Alimento registrato con successo!" });
  } catch (error) {
    console.error("Errore nella registrazione dell'alimento:", error);
    res.status(500).json({ success: false, message: "Si è verificato un errore interno, riprova più tardi." });
  }
};

exports.getAlimentiUtente = async (req, res) => {
  try {
    // MODIFICATO: come sopra, userId da req.userId invece che dal token decodificato qui
    const userId = req.userId;

    // Cerca nel DB tutti gli alimenti che appartengono a questo utente
    const alimenti = await Alimento.find({ utente: userId });
    res.status(200).json({ success: true, alimenti });
  } catch (error) {
    console.error("Errore nel recupero degli alimenti:", error);
    res.status(500).json({ success: false, message: "Si è verificato un errore interno, riprova più tardi." });
  }
};

exports.rimuoviAlimento = async (req, res) => {
  try {
    // MODIFICATO: userId da req.userId
    const userId = req.userId;
    const idAlimento = req.params.id;

    // Elimina l'alimento assicurandoti che appartenga effettivamente a chi lo sta eliminando
    const risultato = await Alimento.findOneAndDelete({ _id: idAlimento, utente: userId });

    // AGGIUNTA: se risultato è null, vuol dire che l'alimento non esisteva
    // oppure apparteneva a un altro utente (findOneAndDelete non lo tocca in quel caso).
    // Senza questo controllo, il client riceverebbe sempre "successo" anche quando
    // in realtà non è stato eliminato nulla, il che è fuorviante.
    if (!risultato) {
      return res.status(404).json({ success: false, message: "Alimento non trovato o non autorizzato." });
    }

    getIO().to(userId.toString()).emit('frigo-aggiornato');

    res.status(200).json({ success: true, message: "Alimento rimosso con successo" });
  } catch (error) {
    console.error("Errore nell'eliminazione dell'alimento:", error);
    res.status(500).json({ success: false, message: "Si è verificato un errore interno, riprova più tardi." });
  }
};