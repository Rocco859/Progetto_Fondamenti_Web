const Alimento = require('../models/Alimento');


//restituisce gli elementi che scadono nei prossimi 7 giorni
exports.getAlimentoScadenza = async (req, res, next) => { 
  try {
    const userId = req.userId;   //legge l'ìd dell'utente da authMiddleware

    const alimenti = await Alimento.find({ utente: userId }); 
    const oggi = new Date();

    const listaFiltrata = alimenti.map(doc => {
        const dataScadenza = new Date(doc.dataScadenza);

        /*calcolo giorni*/
        const diffTempo = dataScadenza.getTime() - oggi.getTime();  //restituisce millisecondi
        const giorniMancanti = Math.ceil(diffTempo / 86400000);     //86400000: ms in un giorno
        return { 
          _id: doc._id,
          nome: doc.nome,
          giorniMancanti: giorniMancanti
        };
      })
      .filter(alimento => alimento.giorniMancanti >= 0 && alimento.giorniMancanti < 7) 
      .sort((a, b) => a.giorniMancanti - b.giorniMancanti);


      //risposta finalw
    res.status(200).json({ success: true, alimenti: listaFiltrata });
  } catch (error) {
    console.error("Errore nel recupero alimenti in scadenza:", error);
    res.status(500).json({ success: false, message: "Si è verificato un errore interno, riprova più tardi." });
  }
};