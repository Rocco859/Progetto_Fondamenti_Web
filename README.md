# Fridgy — Gestisci il tuo frigo

Single Page Application per la gestione del frigorifero e della lista della spesa, con utilizzo del real time assistente virtuale basato su intelligenza artificiale.

**Corso**: Fondamenti del Web — A.A. 2025/2026
**Autori**: Rocco Colicchio, Andrea Di Giacomo, Savino Martire


## 📑 Indice

1. [Descrizione](#1-descrizione)
2. [Stack tecnologico](#2-stack-tecnologico)
3. [Struttura del progetto](#3-struttura-del-progetto)
4. [Prerequisiti](#4-prerequisiti)
5. [Variabili d'ambiente](#5-variabili-dambiente)
6. [Avvio in sviluppo](#6-avvio-in-sviluppo)
7. [Avvio con Docker](#7-avvio-con-docker)
8. [Documentazione delle API](#8-documentazione-delle-api)
9. [Funzionalità principali](#9-funzionalità-principali)


## 1. Descrizione

Fridgy nasce per ridurre lo spreco alimentare domestico. Dopo la registrazione, l'utente può:

- registrare gli alimenti presenti nel frigo con la relativa data di scadenza;
- consultare un pannello dedicato agli alimenti in scadenza entro 7 giorni, ordinati per urgenza;
- gestire una lista della spesa sincronizzata fra tutte le proprie sessioni;
- chiedere consigli su ricette e conservazione a un assistente virtuale.

L'applicazione è una SPA: il browser scarica l'interfaccia una sola volta e successivamente scambia con il server solo dati in formato JSON.


## 2. Stack tecnologico

| Livello | Tecnologia |
|---|---|
| Frontend | React 19 + Vite 8 |
| Backend | Node.js 20 + Express 5 |
| Database | MongoDB 7 + Mongoose 9 |
| Real-time | Socket.io 4 |
| Autenticazione | JSON Web Token + bcrypt |
| Assistente AI | Google Gemini (`@google/generative-ai`) |
| Documentazione API | Swagger (`swagger-jsdoc` + `swagger-ui-express`) |
| Containerizzazione | Docker Compose + Nginx |


## 3. Struttura del progetto

## 3. Struttura del progetto

```
Progetto_Fondamenti_Web/
│
├── fridgy-backend/                        # API REST + server Socket.io
│   ├── controllers/                       # Logica applicativa
│   │   ├── ControllerAlimenti.js          # Calcolo degli alimenti in scadenza
│   │   ├── ControllerAuth.js              # Registrazione e login
│   │   ├── ControllerChatbot.js           # Integrazione con Google Gemini
│   │   ├── ControllerGestioneAlimento.js  # CRUD degli alimenti nel frigo
│   │   ├── ControllerHealth.js            # Controllo di stato del server
│   │   └── ControllerSpesa.js             # CRUD della lista della spesa
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js              # verifyJWT: protegge le rotte private
│   │
│   ├── models/                            # Schemi Mongoose
│   │   ├── Alimento.js                    # Alimento nel frigo
│   │   ├── Spesa.js                       # Elemento della lista della spesa
│   │   └── User.js                        # Utente registrato
│   │
│   ├── routes/                            # Definizione degli endpoint
│   │   ├── AlimentiRoutes.js              # /api/v1/alimenti-scadenza
│   │   ├── AuthRoutes.js                  # /api/v1/register, /api/v1/login
│   │   ├── ChatbotRoutes.js               # /api/v1/chatbot
│   │   ├── GestioneAlimentoRoutes.js      # /api/v1/frigo
│   │   ├── HealthRoutes.js                # /health
│   │   └── SpesaRoutes.js                 # /api/v1/spesa
│   │
│   ├── utils/                             # Funzioni condivise
│   │   ├── validazione.js                 # Controllo dei campi obbligatori
│   │   └── verificaToken.js               # Verifica JWT + esistenza utente
│   │
│   ├── server.js                          # Punto di ingresso: monta rotte e avvia
│   ├── socket.js                          # Configurazione di Socket.io
│   ├── swagger.js                         # Specifica OpenAPI delle API
│   ├── Dockerfile                         # Immagine del backend (node:20-alpine)
│   ├── .dockerignore
│   ├── .env.example                       # Variabili per lo sviluppo locale
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── fridgy-app/                            # Interfaccia React
│   ├── public/
│   │   ├── chatbot-logo.png               # Icona dell'assistente virtuale
│   │   ├── favicon.svg                    # Icona della scheda del browser
│   │   └── logo-app.png                   # Logo dell'applicazione
│   │
│   ├── src/
│   │   ├── components/                    # Un file .jsx + un .css per componente
│   │   │   ├── AddAlimento.jsx/.css       # Form di aggiunta alimento
│   │   │   ├── AlimentiInScadenza.jsx/.css# Pannello degli alimenti in scadenza
│   │   │   ├── AuthPopups.jsx/.css        # Finestre di login e registrazione
│   │   │   ├── ChatbotWidget.jsx/.css     # Chat con l'assistente virtuale
│   │   │   ├── MenuPulsanti.jsx/.css      # Pannelli frigo e lista della spesa
│   │   │   ├── MessaggiNonLetti.jsx/.css  # Notifiche dell'applicazione
│   │   │   └── Navbar.jsx/.css            # Barra di navigazione
│   │   │
│   │   ├── context/
│   │   │   └── AppContext.jsx             # Stato globale + connessione Socket.io
│   │   │
│   │   ├── App.jsx                        # Componente radice
│   │   ├── App.css                        # Stili globali e layout
│   │   ├── config.js                      # URL base del backend
│   │   └── main.jsx                       # Punto di ingresso di React
│   │
│   ├── index.html                         # Pagina HTML che ospita la SPA
│   ├── vite.config.js                     # Configurazione di Vite
│   ├── eslint.config.js                   # Regole di analisi statica
│   ├── Dockerfile                         # Build multi-stage (Vite → Nginx)
│   ├── .dockerignore
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── nginx/
│   └── nginx.conf                         # Reverse proxy per API e WebSocket
│
├── docker-compose.yml                     # Orchestrazione dei tre servizi
├── .env.example                           # Variabili per l'esecuzione con Docker
├── .gitignore
└── README.md
```

Il backend segue il pattern **MVC**: le rotte mappano gli endpoint HTTP sui controller, che contengono la logica applicativa e interrogano i modelli Mongoose. Il middleware `verifyJWT` protegge tutte le rotte che accedono a dati personali, mentre le funzioni in `utils/` centralizzano la logica condivisa fra più controller.

Il frontend adotta la convenzione **un componente, un file CSS**: ogni `.jsx` ha accanto il proprio foglio di stile con lo stesso nome. Lo stato condiviso fra componenti distanti nella gerarchia (autenticazione, popup attivi, connessione Socket.io) è gestito dal Context API in `AppContext.jsx`, evitando il passaggio manuale delle proprietà attraverso i livelli intermedi.


## 4. Prerequisiti

**Per l'esecuzione in sviluppo:**
- Node.js 20 o superiore
- npm
- Un database MongoDB raggiungibile (cluster Atlas oppure installazione locale)

**Per l'esecuzione con Docker:**
- Docker
- Docker Compose

**Servizi esterni:**
- Una chiave API di Google Gemini, ottenibile da [Google AI Studio](https://aistudio.google.com)


## 5. Variabili d'ambiente

| Variabile | Descrizione |
| `MONGO_URI` | Stringa di connessione a MongoDB |
| `JWT_SECRET` | Chiave segreta per la firma dei token |
| `GEMINI_API_KEY` | Chiave API di Google Gemini |
| `FRONTEND_URL` | Origine autorizzata dalla configurazione CORS |

Il progetto usa due file `.env` distinti, perché i due modi di esecuzione richiedono valori diversi:

| File | Usato da | `MONGO_URI` | `FRONTEND_URL` |
| `.env` (radice) | Docker Compose | `mongodb://mongo:27017/fridgy` | `http://localhost` |
| `fridgy-backend/.env` | `npm start` | La propria stringa (es. Atlas) | `http://localhost:5173` |

Entrambi sono esclusi da Git. Per crearli, copiare i rispettivi `.env.example` e compilare i valori mancanti:

`JWT_SECRET` deve essere identico nei due file: un token firmato con una chiave e verificato con un'altra viene sempre rifiutato.


## 6. Avvio in sviluppo

Servono due terminali.

**Terminale 1 — backend:**
```bash
cd fridgy-backend
npm install
npm start
```
Il server si avvia su `http://localhost:3000`.

**Terminale 2 — frontend:**
```bash
cd fridgy-app
npm install
npm run dev
```
L'interfaccia è disponibile su `http://localhost:5173`.

### Script disponibili

| Cartella | Comando | Descrizione |
| `fridgy-backend` | `npm start` | Avvia il server |
| `fridgy-app` | `npm run dev` | Server di sviluppo con aggiornamento automatico |
| `fridgy-app` | `npm run build` | Compila la versione di produzione in `dist/` |
| `fridgy-app` | `npm run preview` | Anteprima locale della build |
| `fridgy-app` | `npm run lint` | Analisi statica del codice |


## 7. Avvio con Docker

Un solo comando dalla radice del progetto avvia l'intero stack:

```bash
docker compose up --build
```

Vengono creati tre container:

| Servizio | Immagine | Ruolo |
| `mongo` | `mongo:7` | Database, con volume persistente |
| `backend` | Build da `fridgy-backend/Dockerfile` | API Express + Socket.io |
| `frontend` | Build multi-stage → `nginx:alpine` | SPA compilata, servita da Nginx |

**Indirizzi risultanti:**

| Indirizzo | Contenuto |
|---|---|
| `http://localhost` | Applicazione |
| `http://localhost:3000/api-docs` | Documentazione Swagger |
| `http://localhost:3000/health` | Controllo di stato |

Nginx svolge il ruolo di **reverse proxy**: serve i file statici della SPA, inoltra le richieste `/api/` al backend e gestisce l'upgrade a WebSocket per `/socket.io/`. Frontend e API risultano così sulla stessa origine, eliminando ogni problema di CORS.

**Comandi utili:**

```bash
docker compose up -d          # avvia in background
docker compose logs -f        # visualizza i log
docker compose down           # ferma e rimuove i container
docker compose down -v        # ...eliminando anche i dati del database
```


## 8. Documentazione delle API

La documentazione interattiva è generata con `swagger-jsdoc` a partire dal file `fridgy-backend/swagger.js` e servita da `swagger-ui-express`:

```
http://localhost:3000/api-docs
```

Dall'interfaccia è possibile consultare ogni endpoint e provarlo direttamente dal browser: dopo aver eseguito il login, il token si inserisce con il pulsante **Authorize** e viene allegato automaticamente alle chiamate protette.

### Riepilogo degli endpoint

| Metodo | Endpoint | Auth | Descrizione |
| GET | `/health` | No | Controllo di stato del server |
| POST | `/api/v1/register` | No | Registrazione di un nuovo utente |
| POST | `/api/v1/login` | No | Accesso, restituisce il token JWT |
| GET | `/api/v1/alimenti-scadenza` | Sì | Alimenti in scadenza entro 7 giorni |
| GET | `/api/v1/frigo` | Sì | Elenco degli alimenti nel frigo |
| POST | `/api/v1/frigo/aggiungi` | Sì | Aggiunge un alimento |
| DELETE | `/api/v1/frigo/:id` | Sì | Rimuove un alimento |
| GET | `/api/v1/spesa` | Sì | Elenco della lista della spesa |
| POST | `/api/v1/spesa/aggiungi` | Sì | Aggiunge un elemento alla lista |
| DELETE | `/api/v1/spesa/:id` | Sì | Rimuove un elemento dalla lista |
| POST | `/api/v1/chatbot/messaggio` | Sì | Invia un messaggio all'assistente |

Il prefisso `/api/v1` consente di introdurre in futuro modifiche non retrocompatibili pubblicando una `/api/v2` senza interrompere i client esistenti.


## 9. Funzionalità principali

### Autenticazione

Le password sono cifrate con **bcrypt** prima del salvataggio. Al login il server emette un **JWT** con scadenza di un giorno, che il client conserva e allega alle richieste nell'header `Authorization: Bearer <token>`.

Il middleware `verifyJWT` verifica la firma del token e controlla che l'utente esista ancora nel database, distinguendo due casi di errore: **401** se l'header è assente, **403** se il token è presente ma non valido, scaduto o riferito a un utente eliminato.

Tutte le query filtrano per utente proprietario, e le eliminazioni verificano l'appartenenza del documento prima di procedere: un utente non può in nessun caso accedere ai dati di un altro.

### Aggiornamenti in tempo reale

Socket.io affianca Express sullo stesso server HTTP. All'apertura della connessione il client invia il proprio token, che viene verificato con la stessa logica usata per le richieste HTTP; il socket viene poi iscritto a una *stanza* identificata dall'id dell'utente.

Quando un alimento o un elemento della spesa viene aggiunto o rimosso, il server emette un evento (`frigo-aggiornato` o `spesa-aggiornata`) **solo verso quella stanza**: tutte le sessioni aperte dello stesso utente si aggiornano da sole.

### Assistente virtuale

Il chatbot usa il modello Gemini di Google. Il client invia il messaggio insieme alla cronologia della conversazione, che il backend inoltra al modello per fornirgli il contesto. La cronologia non viene salvata sul server: vive nello stato del componente React per la durata della sessione.

L'endpoint è protetto da autenticazione, così da impedire un consumo non autorizzato della quota API.