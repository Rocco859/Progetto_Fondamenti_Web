const {GoogleGenerativeAI} = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `Sei l'assistente virtuale di Fridgy, una web app italiana 
per gestire la spesa e ridurre lo spreco alimentare.
Aiuta l'utente a:
- Tenere traccia degli alimenti nel frigo e in dispensa
- Ricordare le scadenze degli alimenti
- Suggerire ricette con gli ingredienti disponibili
- Ridurre gli sprechi alimentari
- Pianificare la lista della spesa
Rispondi SEMPRE in italiano, in modo amichevole e conciso (massimo 3-4 frasi).
Non rispondere a domande che non riguardano cibo, cucina o gestione della spesa.`;

const model = genAI.getGenerativeModel({  //isatanza del modello gemini da usare
    model: 'gemini-3.6-flash',
    systemInstruction: {
        role: "system",
        parts: [{text: SYSTEM_PROMPT}]
    }
})

exports.inviaMessaggio = async (req, res) => {
    try{
        const {testo, cronologia} = req.body;  //estrae dal body della richiesta dell utente il messaggio attuale e la cronologia


        //blocca la richiesta se è vuota o fatta da spazi vuoti
        if (!testo || testo.trim() === '') {   // .trim rimuove gli spazi ai bordi
            return res.status(400).json({
                success: false, 
                message: 'Il messaggio non può essere vuoto.' });
        }


        //converte il formato della webapp con mittente e testo nel formato accettato dall api di gemini
        //(un array di oggetti con role e parts). Se il mittente era l'utente si avrà role "user" altrimenti role "model"
        const cronologiaGemini = (cronologia || []).map(msg=>({
            role: msg.mittente === 'utente' ? 'user' : 'model',
            parts: [{text: msg.testo}]
        }))

        //avvio di una sessione di chat con gemini
        const chat = model.startChat({
            history: cronologiaGemini,
        });


        const risultato = await chat.sendMessage(testo);  //invio messaggio dell'utente
        const rispostaAI =risultato.response.text();  //estrae il testo dalla risposta di gemini
        res.status(200).json({     
            success: true,
            risposta: rispostaAI 
        });

        //gestione errori
    }catch (errore){
        console.error("Errore nel controller cchatbot:", errore.message);
        res.status(500).json({
            success: false,
            message: "Errore durante la comunicazione con l'AI"
        });
    }
    

};


