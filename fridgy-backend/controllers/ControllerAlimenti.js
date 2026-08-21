const Alimento = require('../models/Alimento');
// RIMOSSO: "const jwt = require('jsonwebtoken');"
// Non serve più: la verifica del token ora la fa il middleware verifyJWT,
// non deve essere ripetuta qui dentro (evitiamo duplicazione di codice).

exports.getAlimentoScadenza = async (req, res, next) => {
  try {
    // RIMOSSO tutto questo blocco, ora gestito dal middleware verifyJWT:
    //
    // const authHeader = req.headers.authorization;
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   return res.status(401).json({ success: false, message: "Utente non autorizzato." });
    // }
    // const token = authHeader.split(' ')[1];
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const userId = decoded.id;

    // MODIFICATO: userId ora arriva direttamente da req.userId,
    // impostato dal middleware verifyJWT prima che questo controller venga eseguito
    const userId = req.userId;

    // MODIFICATO: uso await invece di .then/.catch, per uniformità di stile
    // (evitiamo di mischiare try/catch esterno con .then/.catch interno)
    const alimenti = await Alimento.find({ utente: userId });
    const oggi = new Date();

    const listaFiltrata = alimenti
      .map(doc => {
        const dataScadenza = new Date(doc.dataScadenza);

        /*calcolo giorni*/
        const diffTempo = dataScadenza.getTime() - oggi.getTime();
        const giorniMancanti = Math.ceil(diffTempo / 86400000);  /*La differenza delle date javascript la fa in millisecondi, ho trovato il numero di giorni dividendo il valore della differenza per il numero di millisecondi presenti in un giorno */
        return {
          _id: doc._id,
          nome: doc.nome,
          giorniMancanti: giorniMancanti
        };
      })
      .filter(alimento => alimento.giorniMancanti >= 0 && alimento.giorniMancanti < 7) /*filtra solo quelli che hanno meno di 7 giorni alla scadenza*/
      .sort((a, b) => a.giorniMancanti - b.giorniMancanti); /*ordina in base ai giorni mancanti, dal più vicino alla scadenza al più lontano*/

    res.status(200).json({ success: true, alimenti: listaFiltrata });
  } catch (error) {
    // MODIFICATO: ora questo unico catch gestisce anche eventuali errori
    // della query Alimento.find (prima gestiti separatamente col .catch),
    // dato che con await un errore nella Promise viene comunque catturato qui
    console.error("Errore nel recupero alimenti in scadenza:", error);
    res.status(500).json({ success: false, message: "Si è verificato un errore interno, riprova più tardi." });
  }
};