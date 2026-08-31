import { useState, useRef, useEffect } from "react";
import { chatbot } from '../services/api';
import "./ChatbotWidget.css";

/*vomponente da lasciare fuori a chatbotWidget per non ricaricarlo a ogni render*/
function MessaggioChat({ testo, mittente }) {
  const isUtente = mittente === "utente"; //controlla che il mittente del messaggio corrisponda con l'utente attualmente loggato
  return (
    <div className={`messaggio-riga ${isUtente ? "utente" : "ai"}`}>
      <div className={`messaggio-nuvoletta ${isUtente ? "utente" : "ai"}`}>
        {testo} {/*stampa il testo del messaggio all'interno della nuvoletta */}
      </div>
    </div>
  );
}


//puntini di caricamento
function IndicatoreCaricamento() {
  return (
    <div className="caricamento-riga">
      <div className="caricamento-nuvoletta">
        {[0, 1, 2].map((i) => (
          <span
            key={i} //l'indice come key è accettabile perché la lista è statica e non cambia mai, sono sempre gli stessi 3 pallini, non vengono riordinati né rimossi
            className="caricamento-pallino"
          ></span>
        ))}
      </div>
    </div>
  );
}


// Funzione principale
function ChatbotWidget() {
  const [aperta, setAperta] = useState(false); //stato della chat che parte da chiusa (false)
  //Array di tutti i messaggi della chat che parte con un messaggio di benvenuto dell'ai
  const [messaggi, setMessaggi] = useState([
    {
      id: 0,
      testo: "Ciao! Sono l'assistente di Fridgy. Posso aiutarti consigliandoti delle ricette con ciò che hai in frigo",
      mittente: "ai",
      tipo: 'benvenuto',   // messaggio iniziale: escluso dalla cronologia inviata al backend
    },
  ]);
  const [inputTesto, setInputTesto] = useState("");      //stato del testo scritto dall'utente che parte vuoto
  const [caricamento, setCaricamento] = useState(false); //stato del caricamento true (l'ai sta pensando) appariranno i pallini

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
  const inviaMessaggio = async () => { 
    const testo = inputTesto.trim(); //prende il testo digitato e rimuove gli spazi iniziali e finali
    if (!testo || caricamento) return; //se il messaggio è vuoto o l'ai sta rispondendo, blocca l'esecuzione

    const token = localStorage.getItem("tokenFridgy"); //recupera il token JWT dal localStorage

    const nuovoId = Date.now(); //id unico basato sul timestamp attuale
    setMessaggi((prev) => [...prev, { id: nuovoId, testo, mittente: "utente", tipo: 'normale' }]); //aggiunge il messaggio mantenendo i precedenti
    setInputTesto(""); //svuota la casella di testo

    //verifica del token
    if (!token) {
      setMessaggi((prev) => [...prev, {
        id: Date.now(),
        testo: "Non sei loggato. Accedi per usare il chatbot.",
        mittente: "ai",
        tipo: 'errore',   // messaggio di errore: escluso dalla cronologia inviata al backend
      }]);
      return; //se non c'è il token, blocca l'esecuzione
    }

    setCaricamento(true);  //mostra i pallini di caricamento

    //api gemini
    try {
      const cronologiaPerBackend = messaggi
        .filter(m => m.tipo === 'normale')   //filtro che prende solo i messaggi di chat escludendo benvenuto ed errori vari
        .map(m => ({ mittente: m.mittente, testo: m.testo }));
        //prende il valore di messaggi senza l'ultimo messaggio

      //Chiamata al backend
      const dati = await chatbot.inviaMessaggio(testo, cronologiaPerBackend);

      //Aggiunta risposta dell'ai
      setMessaggi((prev) => [...prev,
        { id: Date.now(), testo: dati.risposta, mittente: "ai", tipo: 'normale' }
      ]);

    } catch (errore) {
      console.error("Errore nella chiamata al backend:", errore);
      setMessaggi((prev) => [...prev,
        {
          id: Date.now(),
          testo: "Non riesco a connettermi al server",
          mittente: "ai",
          tipo: 'errore',   //escluso dalla cronologia del backend
        }
      ]);
    } finally {
      setCaricamento(false);
    }

  };


  // Funzionamento tasto invio su tastiera
  const gestisciTasto = (e) => { 
    if (e.key === "Enter" && !e.shiftKey) {  //verifica se il tasto premuto è Invio e che Shift non sia premuto
      e.preventDefault(); //sostituisce il comportamento di default del browser
      inviaMessaggio();   //richiama la funzione di invio
    }
  };


  return (
    <>
      {/* Contenitore principale fisso in basso a sinistra */}
      <div className="chatbot-widget">

        {/*finestra aperta*/}
        {aperta && (
          <div className="chat-window">

            {/*header*/}
            <div className="chat-header">
              <div className="chat-header-info">
                <img src="/chatbot-logo.png" alt="Assistente Fridgy" className="chat-header-logo" />
                <h3>Assistente Fridgy</h3>
              </div>
              {/*X*/}
              <button className="chat-header-chiudi" onClick={toggleChat}>
                ✕
              </button>
            </div>

            {/* Body*/}
            <div ref={chatBodyRef} className="chat-body">
              {/*renderizza ogni messaggioChat */}
              {messaggi.map((msg) => ( //stampa a schermo tutti i messaggi della conversazione
                <MessaggioChat key={msg.id} testo={msg.testo} mittente={msg.mittente} />
              ))}
              {caricamento && <IndicatoreCaricamento />} {/* i pallini appaiono solo mentre l'ai pensa */}
            </div>

            {/*footer*/}
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

        {/* Bottone apri/chiudi*/}
        <button
          type="button"
          className={`chatbot-btn ${aperta ? "aperta" : ""}`}
          onClick={toggleChat}
        >
          <div className="chatbot-btn-icona">
            {aperta ?(
              "✕" 
            ):(
             <img src="/chatbot-logo.png" alt="Assistente Fridgy" className="chatbot-logo-img" />)} {/* icona X se aperta, icona se chiusa */}
          </div>
          <span>{aperta ? "CHIUDI CHAT" : "CHAT CON AI"}</span> {/* testo del bottone */}
        </button>

      </div>
    </>
  );
}

export default ChatbotWidget;