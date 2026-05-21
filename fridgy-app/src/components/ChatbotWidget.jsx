/* ==========================================================
   ChatbotWidget.jsx  –  Componente React per il widget Chatbot
   Fridgy Web App
   ========================================================== */

import { useState, useRef, useEffect } from "react";
import "./ChatbotWidget.css"; // ✅ Import del file CSS separato


// Composizione struttura chat
function MessaggioChat({ testo, mittente }) {
  const isUtente = mittente === "utente"; //controlla che il mittente del messaggio corrisponda con l'utente attualmente loggato
  return (
    // "utente" o "ai" vengono aggiunti come classi CSS aggiuntive, così il CSS sa come colorare e posizionare la nuvoletta
    <div className={`messaggio-riga ${isUtente ? "utente" : "ai"}`}>
      <div className={`messaggio-nuvoletta ${isUtente ? "utente" : "ai"}`}>
        {testo} {/* stampa a schermo il testo del messaggio all'interno della nuvoletta */}
      </div>
    </div>
  );
}


// Indicatore di caricamento del messaggio
function IndicatoreCaricamento() {
  return (
    <div className="caricamento-riga">
      <div className="caricamento-nuvoletta">
        {[0, 1, 2].map((i) => (
          <span
            key={i} //in React ogni elemento dell'array deve essere univoco quindi gli assegniamo il suo indice i come chiave
            className="caricamento-pallino"
            style={{ animationDelay: `${i * 0.2}s` }} //questo stile rimane inline perché è dinamico: cambia per ogni pallino in base all'indice i
          />
        ))}
      </div>
    </div>
  );
}


// Funzione principale
function ChatbotWidget() {

  //definizione dei dati di stato del componente che si aggiorneranno in base alle azioni dell'utente
  const [aperta, setAperta] = useState(false); //stato della chat che parte da chiusa (false)
  //Array di tutti i messaggi della chat che parte con un messaggio di benvenuto dell'ai
  const [messaggi, setMessaggi] = useState([
    {
      id: 0,
      testo: "Ciao! 👋 Sono l'assistente di Fridgy. Posso aiutarti a gestire la tua spesa, controllare le scadenze o suggerirti ricette con quello che hai in frigo. Come posso aiutarti?",
      mittente: "ai",
    },
  ]);
  const [inputTesto, setInputTesto] = useState("");      //stato del testo scritto dall'utente che parte vuoto
  const [caricamento, setCaricamento] = useState(false); //stato del caricamento: se true (l'ai sta pensando) appariranno i pallini

  const chatBodyRef = useRef(null); //per lo scorrimento della chat


  // Scroll automatico all'ultimo messaggio
  useEffect(() => {
    if (chatBodyRef.current) {  //verifica che il riferimento al corpo della chat sia corretto
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight; //imposta la posizione dello scroll all'altezza totale del contenuto
    }
  }, [messaggi, caricamento]); //si attiva quando cambiano messaggi o caricamento


  //interruttore per aprire e chiudere la chat
  const toggleChat = () => setAperta((prev) => !prev); //prende lo stato attuale e lo nega


  //Funzione per l'invio del messaggio
  const inviaMessaggio = async () => { //async perché la chiamata API richiede tempo
    const testo = inputTesto.trim(); //prende il testo digitato e rimuove gli spazi iniziali e finali
    if (!testo || caricamento) return; //se il messaggio è vuoto o l'ai sta rispondendo, blocca l'esecuzione

    // Aggiunge il messaggio dell'utente alla lista
    const nuovoId = Date.now(); //id unico basato sul timestamp attuale
    setMessaggi((prev) => [...prev, { id: nuovoId, testo, mittente: "utente" }]); //aggiunge il messaggio mantenendo i precedenti
    setInputTesto("");     //svuota la casella di testo
    setCaricamento(true);  //mostra i pallini di caricamento

    try {
      // Chiamata all'API Anthropic
      const risposta = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ⚠️ NOTA: in produzione la chiave API non deve mai stare nel frontend!
          // Usare un backend proxy (es. Node.js / PHP) che fa da intermediario.
          "x-api-key": "LA_TUA_API_KEY_QUI",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system: `Sei l'assistente virtuale di Fridgy, una web app per gestire la spesa e ridurre lo spreco alimentare.
Aiuta l'utente a:
- Tenere traccia degli alimenti nel frigo e in dispensa
- Ricordare le scadenze degli alimenti
- Suggerire ricette con gli ingredienti disponibili
- Ridurre gli sprechi alimentari
- Pianificare la lista della spesa
Rispondi sempre in italiano, in modo amichevole e conciso (massimo 3-4 frasi).`,
          messages: [
            ...messaggi
              .filter((m) => m.mittente !== "sistema")
              .map((m) => ({
                role: m.mittente === "utente" ? "user" : "assistant",
                content: m.testo,
              })),
            { role: "user", content: testo },
          ],
        }),
      });

      if (!risposta.ok) {
        throw new Error(`Errore API: ${risposta.status}`);
      }

      const dati = await risposta.json();
      const testoAi =
        dati.content?.[0]?.text ||
        "Mi dispiace, non ho ricevuto una risposta valida. Riprova!";

      setMessaggi((prev) => [
        ...prev,
        { id: Date.now(), testo: testoAi, mittente: "ai" },
      ]);
    } catch (errore) {
      console.error("Errore nella chiamata all'AI:", errore);
      setMessaggi((prev) => [
        ...prev,
        {
          id: Date.now(),
          testo: "⚠️ Ops! Si è verificato un errore. Controlla la tua connessione e riprova.",
          mittente: "ai",
        },
      ]);
    } finally {
      setCaricamento(false); //nasconde i pallini sia in caso di successo che di errore
    }
  };


  // Funzionamento tasto invio su tastiera
  const gestisciTasto = (e) => { //funzione che accetta un evento (e) come parametro
    if (e.key === "Enter" && !e.shiftKey) {  //verifica se il tasto premuto è Invio e che Shift non sia premuto
      e.preventDefault(); //sostituisce il comportamento di default del browser (andare a capo)
      inviaMessaggio();   //richiama la funzione di invio
    }
  };


  return (
    <>
      {/* Contenitore principale fisso in basso a sinistra */}
      <div className="chatbot-widget">

        {/* Finestra chat — visibile solo se aperta è true */}
        {aperta && (
          <div className="chat-window">

            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <h3>Assistente Fridgy</h3>
              </div>
              {/* Pulsante X per chiudere */}
              <button className="chat-header-chiudi" onClick={toggleChat}>
                ✕
              </button>
            </div>

            {/* Body messaggi */}
            <div ref={chatBodyRef} className="chat-body">
              {messaggi.map((msg) => ( //stampa a schermo tutti i messaggi della conversazione
                <MessaggioChat key={msg.id} testo={msg.testo} mittente={msg.mittente} />
              ))}
              {caricamento && <IndicatoreCaricamento />} {/* i pallini appaiono solo mentre l'ai sta pensando */}
            </div>

            {/* Footer input */}
            <div className="chat-footer">
              <input
                type="text"
                className="chat-input"
                value={inputTesto}
                onChange={(e) => setInputTesto(e.target.value)} //aggiorna lo stato ad ogni tasto premuto
                onKeyDown={gestisciTasto}
                placeholder="Chiedi qualcosa a Fridgy…"
                disabled={caricamento} //bloccato mentre l'ai risponde
              />
              <button
                type="button"
                className="chat-bottone-invio"
                onClick={inviaMessaggio}
                disabled={caricamento || !inputTesto.trim()} //disabilitato se l'ai sta pensando o la casella è vuota
              >
                ➤
              </button>
            </div>

          </div>
        )}

        {/* Bottone apri/chiudi — la classe "aperta" cambia il colore di sfondo via CSS */}
        <button
          type="button"
          className={`chatbot-btn ${aperta ? "aperta" : ""}`}
          onClick={toggleChat}
        >
          <div className="chatbot-btn-icona">
            {aperta ? "✕" : "🤖"} {/* icona X se aperta, robottino se chiusa */}
          </div>
          <span>{aperta ? "CHIUDI CHAT" : "CHAT CON AI"}</span> {/* testo del bottone */}
        </button>

      </div>
    </>
  );
}

export default ChatbotWidget;
