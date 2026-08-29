const Alimento = require('../models/Alimento');
const { getIO } = require('../socket');
const {campiMancanti} = require('../utils/validazione');

exports.registraAlimento = async (req, res) => {
  try {
    const userId = req.userId;

    //recupero dei dati dal frontend
    const { nomeAlimento, scadenzaAlimento, quantitaAlimento } = req.body;


    //verifica che siano stati compilati tutti i campi
    const mancanti = campiMancanti(req.body, ['nomeAlimento', 'scadenzaAlimento', 'quantitaAlimento']);
    if (mancanti.length > 0){
      return res.status(400).json({
        success: false,
        message: `Campi obbligatori mancanti: ${mancanti.join(', ')}`
      })
    }

    //creazione alimento
    const nuovoAlimento = new Alimento({
      nome: nomeAlimento,
      dataScadenza: scadenzaAlimento,
      quantita: quantitaAlimento,
      utente: userId
    });
    await nuovoAlimento.save();


    //aggiornamento del frigo real time
    getIO().to(userId.toString()).emit('frigo-aggiornato');


    //risposta finale
    res.status(201).json({ success: true, message: "Alimento registrato con successo!" });
  } catch (error) {
    console.error("Errore nella registrazione dell'alimento:", error);
    res.status(500).json({ success: false, message: "Si è verificato un errore interno, riprova più tardi." });
  }
};

exports.getAlimentiUtente = async (req, res) => {
  try {
    const userId = req.userId;

    //ricerca nel db di tutti gli alimenti che appartengono a questo utente
    const alimenti = await Alimento.find({ utente: userId });
    res.status(200).json({ success: true, alimenti });
  } catch (error) {
    console.error("Errore nel recupero degli alimenti:", error);
    res.status(500).json({ success: false, message: "Si è verificato un errore interno, riprova più tardi." });
  }
};

exports.rimuoviAlimento = async (req, res) => {
  try {
    const userId = req.userId;
    const idAlimento = req.params.id;  //legge l'id dell almento da eliminare dai parametri dell'URL

    // Elimina alimento
    const risultato = await Alimento.findOneAndDelete({ _id: idAlimento, utente: userId });

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