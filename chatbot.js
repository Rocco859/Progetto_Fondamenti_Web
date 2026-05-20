/* ==========================================================
   chatbot.js  –  Componente React per il widget Chatbot
   Fridgy Web App  |  Separato dall'HTML principale
   ========================================================== */


/** estrare da React i tre strumenti scritti tra parentesi graffe attraverso la destrutturazione degli oggetti */
const { useState, useRef, useEffect } = React;   
// Composizione struttura chat
function MessaggioChat({ testo, mittente }) { 
  const isUtente = mittente === "utente"; //controlla che il mittente del messaggio corrisponda con l'utente attualmente loggato
  return (
    <div 
        style={{
        display: "flex",
        justifyContent: isUtente ? "flex-end" : "flex-start",  //operatore ternario (if) se la condizione espressa prima è vera allora il messaggio verrà posizionato a destera altrimenti a sinistra
        marginBottom: "10px",
      }}
    >
      {/* nuvoletta colorata all'interno della quale ci sarà il messaggio */}
      <div
        style={{
          maxWidth: "75%",
          padding: "10px 14px",
          borderRadius: isUtente ? "18px 18px 4px 18px" : "18px 18px 18px 4px", //operatore ternario (if) per decidere la forma della nuvoletta in base al mittente del  messaggio
          backgroundColor: isUtente ? "#3b6b4c" : "#f0f4f1", //operatore ternario (if) per decidere il colore dello sfondo della nuvoletta
          color: isUtente ? "#ffffff" : "#234b31",
          fontSize: "14px",
          lineHeight: "1.5",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        {testo} {/* stampa a schermo il testo del messaggio all'interno della nuvoletta definita prima */}
      </div>
    </div>
  );
}

// Indicatore di caricamento del messaggio
function IndicatoreCaricamento() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "10px" }}> {/* allinea il testo a sinistra */}
      <div
        style={{     //stile dei pallini di caricamento
          padding: "12px 16px",
          borderRadius: "18px 18px 18px 4px",
          backgroundColor: "#f0f4f1",
          display: "flex",
          gap: "5px",           //per distanziare equamente i tra pallini tra di loro
          alignItems: "center", //per disporre i tre pallini al centro della riga
        }}
      >
        
        {[0, 1, 2].map((i) => (
          <span
            key={i} //in React ogni elemento dell array deve essere univoco quindi gli assegnamo il suo indice i come chiave
            style={{
              //forma del pallino
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              //colore del pallino
              backgroundColor: "#3b6b4c",
              display: "inline-block",
              //animazione bounce (rimbalzo)
              animation: "bounce 1.2s infinite",
              animationDelay: `${i * 0.2}s`,  //usa l'indice del pallino per riardarne la partenza (Il primo partira a 0s, il secodno a 0.2s e il terzo a 0.4s)
            }}
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
  //Array di tutti i messaggi della chat che parte con un messaggio di benevenuto dell'ai
  const [messaggi, setMessaggi] = useState([   
    {
      id: 0,
      testo: "Ciao! 👋 Sono l'assistente di Fridgy. Posso aiutarti a gestire la tua spesa, controllare le scadenze o suggerirti ricette con quello che hai in frigo. Come posso aiutarti?",
      mittente: "ai",
    },
  ]);
  const [inputTesto, setInputTesto] = useState("");   //stato del testo scritto dall'utente che parte vuoto
  const [caricamento, setCaricamento] = useState(false); //stato del caricamento del messaggio, se è true (l'ai sta pensando) appariranno i pallini di caricamento
  const chatBodyRef = useRef(null); //per lo scorrimento della chat (useRef è un hook di React che permette di creare un riferimento a un elemento dell'html, in questo caso il corpo della chat)
  const inputRef = useRef(null); //Per il cursore del testo (DA ELEMINARE MOLTO PROBABILMENTE



  // Scroll automatico all'ultimo messaggio
  useEffect(() => {
    if (chatBodyRef.current) {  //verifica che il riferimento al corpo della chat sia corretto
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight; //imposta la posizione dello scroll del corpo della chat all'altezza totale del contenuto, in questo modo si assicura che l'ultimo messaggio sia sempre visibile
    }
  }, [messaggi, caricamento]); //gli passiamo anche il caricamento perchè i tre puntini e come se fossero un messaggio, quindi prendono spazio

  
  
  
  // Focus sull'input quando la chat si apre  (DA ELMINIARE MOLTO PRBABILMENTE)
/*useEffect(() => {
    if (aperta && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [aperta]);  */


  //interruttore per aprire e chiudere la chat (Arrow function che richiama setAperta che andrà a modificare lo stato della variabile aperta
  const toggleChat = () => setAperta((prev) => !prev); //((prev) => !prev) prende lo stato in cui si trova e lo nega in modo tale da cambniare lo stato

  
  //Funzione per l'invio del messaggio
  const inviaMessaggio = async () => { //Uso async perché dovremo fare una chiamata all'API di un ai quidni servirà tempo perciò diciamo a javaScript di andare avanti
    const testo = inputTesto.trim(); //Prende in input ciò che ha digitato l'utente e lo salva nella costante testo, con il metodo .trim() rimuove gli spazi all'inizio e alla fine del testo
    if (!testo || caricamento) return; // se il messaggio è vuoto o se sta caricando la risposta del bot allora il codice si blocca e non va avanti



    // Funzione che stampa il messaggio dell'utente a schermo
    const nuovoId = Date.now();   //crea un id unico per il messaggio basato sul timestamp attuale (Tempo in millisecondi dal 1°gennaio 1970)
    setMessaggi((prev) => [...prev, { id: nuovoId, testo, mittente: "utente" }]); //crea un nuovo array di messaggi e gli mette dentro gli lementi dell'array precedente (Con l'opertore di espansione(...prev)) e aggiunge alla fine il messaggio appena inviato
    setInputTesto("");  //Cancella il messaggio che è stato appena inviato
    setCaricamento(true);  //Cambia lo stato della variabile di caricamento (Appaiono i puntini)

   /*try
      // ── Chiamata all'API Anthropic ───────────────────────
      const risposta = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // NOTA: in produzione la chiave API non deve mai stare nel frontend!
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
      setCaricamento(false);
    }*/
  };

 
 
  // Funzionamento tasto invio su tastiera
  const gestisciTasto = (e) => { //Funzione che accetta un evento (e) come parametro
    if (e.key === "Enter" && !e.shiftKey) {  //Verifica se il tasto premuto è l'invio e se il tasto shift non è premuto
      e.preventDefault(); //il browser di default va a capo, quindi viene sostituita la sua azione di default con la nostra funzione di invio del messaggio
      inviaMessaggio(); //se le condizioni sono verificate richiama la funzione invia messaggio
    }
  };

  return (
    <> 
    {/*<style>{`                     ANIMAZIONE PALLINI DI CARICAMENTO DA VEDERE SE INSERIRE O MENO
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes slideFadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1);    }
        }
        @keyframes slideFadeOut {
          from { opacity: 1; transform: translateY(0)  scale(1);    }
          to   { opacity: 0; transform: translateY(20px) scale(0.97); }
        }
      `}</style> */}

      
      
      <div                   //Contenitore principale del widget
        id="chatbot-widget"
        style={{
          position: "fixed",
          bottom: "40px",
          left: "40px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        
        
        {/* ── Finestra chat ── */}
        {aperta && (  //se la variabile aperta è true allora react passa al div, se e fase react ignora il blocco di codice e non apre la finestra sullo schermo
          <div                //contenitore per la finsetra della chat
            id="chat-window"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              width: "400px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              marginBottom: "15px",
              height: "500px",
              boxShadow: "0 20px 60px rgba(59,107,76,0.18)",
              animation: "slideFadeIn 0.25s ease forwards",
            }}
          >
            
            
            {/* contenitore dell header */}
            <div                       
              className="chat-header"
              style={{
                backgroundColor: "#3b6b4c",
                color: "#ffffff",
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >

              
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>  {/*posizione l'header orizzontalmente */}
          {/*     <div                        //icona del 
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#6aad80",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                  }}
                >
                  🥦
                </div>  */}
                <div>         {/*nome bot*/}
                  <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>
                    Assistente Fridgy
                  </h3>
                </div>
              </div>



              {/* Pulsante X per chiudere */}
              <button
                onClick={toggleChat}   //richiama la funzione toggleChat quando viene cliccato
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "20px",
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: "4px",
                  opacity: 0.8,
                  transition: "opacity 0.2s",
                }}>
                ✕
              </button>
            </div>



            {/* Body messaggi */}
            <div
              ref={chatBodyRef}     //assegna il riferimento al corpo della chat per poter gestire lo scroll automatico
              className="chat-body"
              style={{
                flex: 1,
                padding: "15px",
                overflowY: "auto",
                backgroundColor: "#fafcfb",
              }}
            >
              {messaggi.map((msg) => (       //funzione che stampa a schermo tutta la conversazione 
                <MessaggioChat key={msg.id} testo={msg.testo} mittente={msg.mittente} />  //per ogni messaggio richiama la componente MessaggioChat e gli passa testo mittente e id
              ))}
              {caricamento && <IndicatoreCaricamento />}  {/* se la variabile caricamento è vera, ovvero se l'utente ha mandato il messaggio, apparirà il caricament0 (i tre puntini). appena arriva la risposta caricamento sarà falso e spariranno i puntini */}
            </div>

            {/* Footer input */}
            <div                     //contenitore per l'input dei messaggi
              className="chat-footer"
              style={{
                backgroundColor: "#f0f0f0",
                padding: "10px",
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <input
              //ref={inputRef}
                type="text"
                value={inputTesto}    //collega cio che viene stampato a video con l'inputTesto, in questo modo ogni volta che l'utente scrive qualcosa si aggiorna lo stato di inputTesto e quindi ciò che viene visualizzato nell'input
                onChange={(e) => setInputTesto(e.target.value)}  //salva ogni valore digitato dall utente nell inputTesto
                onKeyDown={gestisciTasto}  //richiama la funzione gestisciTasto per poter usare il tasto invio
                placeholder="Chiedi qualcosa a Fridgy…"
                disabled={caricamento}   //quando l'ai sta pensando non si possono mandare messaggi
                style={{
                  flex: 1,
                  padding: "8px 14px",
                  borderRadius: "20px",
                  border: "2px solid #3b6b4c",
                  fontSize: "14px",
                  outline: "none",
                  backgroundColor: caricamento ? "#f5f5f5" : "#ffffff",
                }}
              />
              <button
                type="button"
                onClick={inviaMessaggio} //quando viene cliccato il bottone si richiama la funzione InviaMessaggio per mandare il messaggio
                disabled={caricamento || !inputTesto.trim()}  //il tasto di invio è disabilitato se l ai sta pensando o se la casella di testo è vuota
                style={{
                  backgroundColor:
                    caricamento || !inputTesto.trim() ? "#a0bfa9" : "#3b6b4c",
                  color: "#ffffff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontWeight: 600,
                  fontSize: "14px",
                  transition: "background-color 0.2s",
                }}
              >
                ➤
              </button>
            </div>
          </div>
        )}

        {/* ── Bottone apri/chiudi ── */}
        <button
          type="button"
          className="chatbot-btn"
          onClick={toggleChat}  //se si clicca il bottone richia,ma la funzione toggleChat per aprire o chiudere la chat
          style={{
            backgroundColor: aperta ? "#234b31" : "#3b6b4c",
            color: "#ffffff",
            border: "none",
            padding: "12px 25px 12px 12px",
            borderRadius: "50px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontWeight: 600,
            fontSize: "14px",
            boxShadow: "0 8px 20px rgba(59,107,76,0.3)",
            cursor: "pointer",
            transition: "transform 0.2s, background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}  //ingrandisce il tasto quando ci si passa sppra con il cursore
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}     //quando il cursore lascia l'area del tasto esso ritorna come proma
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "2px solid #ffffff",
              backgroundColor: "#6aad80",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
            }}
          >
            {aperta ? "✕" : "🤖"}   {/*se la chat è aperta viene mostrata una x, altrimenti il robottino*/}
          </div>
          <span>{aperta ? "CHIUDI CHAT" : "CHAT CON AI"}</span>  {/*se la chat è aperta viene mostrato il testo chiudi chat, altrimenti chat con ai*/}
        </button>
      </div>
    </>
  );
}

// collegamento react-html
const contenitore = document.getElementById("chatbot-root"); //punto dell'html a cui si attaccherà tutto il codice
const root = ReactDOM.createRoot(contenitore);  //contenitore cosi diventa una radice di react e verrà interamente gestito da esso
root.render(<ChatbotWidget />);   //react prende l'oggetto nell'html ed esegue tutto il codiceal suo intenro.
