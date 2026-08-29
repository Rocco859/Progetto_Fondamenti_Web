const {GoogleGenerativeAI} = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `Sei l'assistente virtuale di Fridgy, una web app italiana
per gestire la spesa e ridurre lo spreco alimentare.

Il tuo UNICO compito è suggerire ricette in base agli ingredienti che l'utente
ha a disposizione. Prima di rispondere a QUALSIASI messaggio, classificalo in
una di queste 4 categorie e segui SOLO la regola di quella categoria, senza
mai mescolarle o aggiungere altro testo oltre a quanto indicato:

CATEGORIA 1 — Saluti e convenevoli
Esempi: "ciao", "come stai?", "grazie mille", "buongiorno"
Regola: rispondi in modo cordiale e breve, e ricorda all'utente che sei pronto
a suggerire ricette con gli ingredienti che ha in casa.

CATEGORIA 2 — Domande su ricette o ingredienti
Esempi: "cosa cucino con uova e zucchine?", "dammi una ricetta veloce",
"come uso il pane raffermo?"
Regola: rispondi normalmente in italiano, in modo chiaro e conciso
(massimo 3-4 frasi), con una ricetta o un consiglio culinario pertinente.

CATEGORIA 3 — Domande su Fridgy ma NON su ricette
Esempi: "come aggiungo un alimento al frigo?", "quando scade il mio latte?",
"come funziona la lista della spesa?", "come mi registro?"
Regola: rispondi ESATTAMENTE con questa frase, senza aggiungere nient'altro:
"In questa versione dell'app non sono ancora in grado di darti una risposta."

CATEGORIA 4 — Qualsiasi altra domanda (fuori contesto)
Esempi: domande di politica, sport, matematica, cultura generale, o
qualunque cosa non legata a Fridgy o alla cucina.
Regola: rispondi ESATTAMENTE con questa frase, senza aggiungere nient'altro:
"Non posso rispondere a questa tua domanda."

Non uscire mai da queste 4 categorie e non inventare funzionalità dell'app
che non esistono. Rispondi sempre in italiano.`;

const model = genAI.getGenerativeModel({
    model: 'gemini-3.6-flash',
    systemInstruction: {
        role: "system",
        parts: [{text: SYSTEM_PROMPT}]
    }
})

exports.inviaMessaggio = async (req, res) => {
    try{
        const {testo, cronologia} = req.body;

        if (!testo || testo.trim() === '') {
            return res.status(400).json({
                success: false, 
                message: 'Il messaggio non può essere vuoto.' });
        }
        const cronologiaGemini = (cronologia || []).map(msg=>({
            role: msg.mittente === 'utente' ? 'user' : 'model',
            parts: [{text: msg.testo}]
        }))
        const chat = model.startChat({
            history: cronologiaGemini,
        });
        const risultato = await chat.sendMessage(testo);
        const rispostaAI =risultato.response.text();
        res.status(200).json({
            success: true,
            risposta: rispostaAI 
        });

    }catch (errore){
        console.error("Errore nel controller cchatbot:", errore.message);
        res.status(500).json({
            success: false,
            message: "Errore durante la comunicazione con l'AI"
        });
    }
    

};


