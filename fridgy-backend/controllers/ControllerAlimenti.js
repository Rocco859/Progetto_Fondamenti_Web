const Alimento = require('../models/Alimento');
const jwt = require('jsonwebtoken');

exports.getAlimentoScadenza = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Utente non autorizzato." });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; 

        Alimento.find({ utente: userId }).then(alimenti => {
        const oggi = new Date();

        const listaFiltrata = alimenti.map(doc => {
            const dataScadenza = new Date(doc.dataScadenza);

            /*calcolo giorni*/
            const diffTempo = dataScadenza.getTime() - oggi.getTime();
            const giorniMancanti = Math.ceil(diffTempo / 86400000);  /*La differenza delle daate javascript la fa in millisecondi, ho trovato il numero di giorni dividendo il valore della differenza per il numero di millisecondi presenti in un giorno */
            return {
                _id: doc._id,
                nome: doc.nome,
                giorniMancanti: giorniMancanti
            };
        })
            .filter(alimento => alimento.giorniMancanti >= 0 && alimento.giorniMancanti < 7) /*filtra solo quelli che hanno meno di 7 giorni alla scadenza*/
            .sort((a,b) => a.giorniMancanti - b.giorniMancanti); /*ordina in base ai giorni mancanti, dal più vicino alla scadenza al più lontano*/

            res.json(listaFiltrata);
        })
        .catch(error => {
            res.status(500).json({ error: true, message: error.message });
        });
    } catch (error) {
        console.error("Errore nel recupero alimenti in scadenza:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
