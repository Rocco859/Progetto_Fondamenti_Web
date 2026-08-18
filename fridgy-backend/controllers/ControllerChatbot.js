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

const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_PROMPT }]
    }
});


/*funzione per ricevere il messaggio di da react e risponde con gemini*/
/* exports.inviaMessaggio = async (req, res) => {
    try{
        const {testo, cronologia } = req.body;

        if(!testo || testo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Il messaggio non può essere vuoto'
            });
        }

        const cronologiaGemini = (cronologia || []).map(msg => ({
            role: msg.mittente === 'utente' ? 'user' : 'model',
            parts:[{text: msg.testo}]
        }))


        const chat = model.startChat({
            history: cronologiaGemini,
        });


        const risultato = await chat.sendMessage(testo);

        const rispostaAI = risultato.response.text();

        res.status(200).json({
            success: true,
            risposta: rispostaAI
        });
    }catch (errore){
        console.error('Errore nel controller chatbot:', errore.message);

        res.status(500).json({
            success: false,
            message: "Errore durante la comunicazione con l'ai",

        })
    }
} */  /* TEMPORANEMAENTE SOSTITUITO DA CIO CHE SEGUE PER CERCARE DI AGGIUSTARE IL CHATBOT*/


exports.inviaMessaggio = async (req, res) => {
    console.log("--- STEP 1: controller avviato ---");
    console.log("GEMINI_API_KEY presente?", !!process.env.GEMINI_API_KEY);
    
    try {
        const { testo, cronologia } = req.body;
        console.log("--- STEP 2: testo ricevuto ---", testo);

        if (!testo || testo.trim() === '') {
            return res.status(400).json({ success: false, message: 'Messaggio vuoto' });
        }

        const cronologiaGemini = (cronologia || []).map(msg => ({
            role: msg.mittente === 'utente' ? 'user' : 'model',
            parts: [{ text: msg.testo }]
        }));
        console.log("--- STEP 3: cronologia convertita ---");

        const chat = model.startChat({ history: cronologiaGemini });
        console.log("--- STEP 4: chat avviata ---");

        const risultato = await chat.sendMessage(testo);
        console.log("--- STEP 5: risposta ricevuta da Gemini ---");

        const rispostaAI = risultato.response.text();

        res.status(200).json({ success: true, risposta: rispostaAI });

    } catch (errore) {
        console.error("--- ERRORE COMPLETO ---");
        console.error("Messaggio:", errore.message);
        console.error("Stack:", errore.stack);
        res.status(500).json({ success: false, message: "Errore AI" });
    }
};