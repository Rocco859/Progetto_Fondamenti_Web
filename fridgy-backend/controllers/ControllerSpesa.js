const Spesa = require('../models/Spesa');

const {getIO} = require('../socket');
const {campiMancanti} = require('../utils/validazione');

//recupero della spesa
exports.getListaSpesa = async (req, res) => {  
  try {
    const userId = req.userId;

    const lista = await Spesa.find({ utente: userId });
    res.status(200).json({ success: true, lista });
  } catch (error) {
    console.error("Errore nel recupero della lista della spesa:", error);
    res.status(500).json({ success: false, message: "Si è verificato un errore interno, riprova più tardi."  });
  }
};

exports.aggiungiSpesa = async (req, res) => {
  try {
    const userId = req.userId;
    const { nomeAlimento } = req.body;
    const mancanti = campiMancanti(req.body, ['nomeAlimento']);
    if (mancanti.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Campi obbligatori mancanti: ${mancanti.join(', ')}`
      });
    }
    const nuovoElemento = new Spesa({ nome: nomeAlimento, utente: userId });
    await nuovoElemento.save();

    //aggioranmento real time
    getIO().to(userId.toString()).emit('spesa-aggiornata');
    
    res.status(201).json({ success: true, elemento: nuovoElemento });
  } catch (error) {
    console.error("Errore nell'aggiunta alla lista della spesa:", error);
    res.status(500).json({ success: false, message: "Si è verificato un errore interno, riprova più tardi." });
  }
};

exports.rimuoviSpesa = async (req, res) => {
  try {
    const userId = req.userId;
    const idElemento = req.params.id;

  
    const elementoRimosso = await Spesa.findOneAndDelete({ _id: idElemento, utente: userId });
    if (!elementoRimosso) {
      return res.status(404).json({ success: false, message: "Alimento non trovato." });
    }

    getIO().to(userId.toString()).emit('spesa-aggiornata');
    res.status(200).json({ success: true, message: "Alimento rimosso dalla lista." });
  } catch (error) {
    console.error("Errore nell'eliminazione dalla lista della spesa:", error);
    res.status(500).json({ success: false, message: "Si è verificato un errore interno, riprova più tardi." });
  }
};
