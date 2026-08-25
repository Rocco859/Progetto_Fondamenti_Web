// Importa la libreria che genera la specifica OpenAPI a partire da un
// oggetto di configurazione JavaScript.
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        // Versione dello standard OpenAPI utilizzata
        openapi: "3.0.0",

        info: {
            title: "Fridgy API",
            version: "1.0.0",
            description:
                "API backend per Fridgy — gestione frigo, lista della spesa e assistente AI. Progetto per il corso di Fondamenti del Web A.A. 2025/2026",
        },

        // Indirizzi su cui l'API è raggiungibile. Swagger UI li mostra in
        // un menu a tendina e usa quello selezionato per le prove dal vivo.
        servers: [
            {
                url: "http://localhost:3000",
                description: "Sviluppo locale (backend avviato con npm start)",
            },
            {
                url: "http://localhost",
                description: "Ambiente containerizzato (Docker + Nginx sulla porta 80)",
            },
        ],

        // I tag raggruppano gli endpoint per area funzionale nell'interfaccia
        tags: [
            { name: "Sistema", description: "Controllo di stato del server" },
            { name: "AuthController", description: "Registrazione e autenticazione utente" },
            { name: "AlimentiController", description: "Consultazione alimenti in scadenza" },
            { name: "GestioneAlimentoController", description: "Gestione del contenuto del frigo" },
            { name: "SpesaController", description: "Gestione della lista della spesa" },
            { name: "ChatbotController", description: "Assistente virtuale basato su Google Gemini" },
        ],

        components: {
            // Descrive il meccanismo di autenticazione. Grazie a questo,
            // Swagger UI mostra il pulsante "Authorize" dove incollare il
            // token, che viene poi allegato automaticamente alle richieste.
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Inserire il token JWT ottenuto da /api/v1/login",
                },
            },

            // Schemi riutilizzabili: definiti una volta, richiamati ovunque
            // servano con $ref. Evita di ripetere le stesse strutture.
            schemas: {
                // ---------- Autenticazione ----------
                RegisterRequest: {
                    type: "object",
                    required: ["nome", "cognome", "codiceFiscale", "email", "password"],
                    properties: {
                        nome: { type: "string", example: "Rocco" },
                        cognome: { type: "string", example: "Colicchio" },
                        codiceFiscale: { type: "string", example: "CLCRCC00A01A662X" },
                        email: { type: "string", format: "email", example: "rocco@example.com" },
                        password: { type: "string", format: "password", minLength: 8, example: "password123" },
                    },
                },

                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email", example: "rocco@example.com" },
                        password: { type: "string", format: "password", example: "password123" },
                    },
                },

                AuthResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "👋 Bentornato!" },
                        token: { type: "string", description: "Token JWT valido 1 giorno" },
                    },
                },

                // ---------- Alimenti ----------
                Alimento: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0d" },
                        nome: { type: "string", example: "Latte" },
                        dataScadenza: { type: "string", format: "date", example: "2026-09-01" },
                        quantita: { type: "integer", default: 1, example: 2 },
                        utente: { type: "string", description: "ObjectId dell'utente proprietario" },
                    },
                },

                AlimentoInScadenza: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        nome: { type: "string", example: "Yogurt" },
                        giorniMancanti: {
                            type: "integer",
                            description: "Giorni residui alla scadenza (0 = scade oggi)",
                            example: 3,
                        },
                    },
                },

                NuovoAlimentoRequest: {
                    type: "object",
                    required: ["nomeAlimento", "scadenzaAlimento", "quantitaAlimento"],
                    properties: {
                        nomeAlimento: { type: "string", example: "Yogurt" },
                        scadenzaAlimento: { type: "string", format: "date", example: "2026-09-10" },
                        quantitaAlimento: { type: "integer", example: 4 },
                    },
                },

                // ---------- Spesa ----------
                Spesa: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        nome: { type: "string", example: "Pane" },
                        utente: { type: "string" },
                    },
                },

                NuovaSpesaRequest: {
                    type: "object",
                    required: ["nomeAlimento"],
                    properties: {
                        nomeAlimento: { type: "string", example: "Pane" },
                    },
                },

                // ---------- Chatbot ----------
                MessaggioChat: {
                    type: "object",
                    properties: {
                        mittente: { type: "string", enum: ["utente", "ai"] },
                        testo: { type: "string" },
                    },
                },

                ChatbotRequest: {
                    type: "object",
                    required: ["testo"],
                    properties: {
                        testo: { type: "string", example: "Cosa posso cucinare con uova e zucchine?" },
                        cronologia: {
                            type: "array",
                            description:
                                "Storico della conversazione, inviato dal client a ogni richiesta. Non viene salvato lato server.",
                            items: { $ref: "#/components/schemas/MessaggioChat" },
                        },
                    },
                },

                ChatbotResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        risposta: { type: "string", example: "Potresti preparare una frittata con zucchine!" },
                    },
                },

                // ---------- Generiche ----------
                SuccessMessage: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Operazione completata con successo" },
                    },
                },

                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "Si è verificato un errore interno, riprova più tardi." },
                    },
                },
            },
        },

        paths: {
            // ==================== SISTEMA ====================
            "/health": {
                get: {
                    tags: ["Sistema"],
                    summary: "Controllo di stato del server",
                    description: "Verifica che l'API sia raggiungibile. Non richiede autenticazione.",
                    responses: {
                        200: {
                            description: "Server attivo",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Fridgy API is running" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },

            // ==================== AUTENTICAZIONE ====================
            "/api/v1/register": {
                post: {
                    tags: ["AuthController"],
                    summary: "Registrazione di un nuovo utente",
                    description:
                        "La password viene cifrata con bcrypt prima del salvataggio. In caso di successo restituisce già un token, così l'utente risulta autenticato senza dover fare login.",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/RegisterRequest" },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: "Utente registrato, token restituito",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } },
                            },
                        },
                        400: {
                            description:
                                "Campi obbligatori mancanti, password inferiore a 8 caratteri, oppure email/codice fiscale già registrati",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                        500: {
                            description: "Errore interno del server",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                    },
                },
            },

            "/api/v1/login": {
                post: {
                    tags: ["AuthController"],
                    summary: "Accesso di un utente esistente",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } },
                        },
                    },
                    responses: {
                        200: {
                            description: "Accesso riuscito, token restituito",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } },
                            },
                        },
                        400: {
                            description: "Email o password errate",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                        500: {
                            description: "Errore interno del server",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                    },
                },
            },

            // ==================== ALIMENTI IN SCADENZA ====================
            "/api/v1/alimenti-scadenza": {
                get: {
                    tags: ["AlimentiController"],
                    summary: "Alimenti in scadenza entro 7 giorni",
                    description:
                        "Restituisce gli alimenti dell'utente autenticato con meno di 7 giorni alla scadenza, ordinati dal più urgente.",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: "Elenco degli alimenti in scadenza",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            alimenti: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/AlimentoInScadenza" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        401: {
                            description: "Token mancante",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                        403: {
                            description: "Token non valido o scaduto, oppure utente non più esistente",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                        500: {
                            description: "Errore interno del server",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                    },
                },
            },

            // ==================== FRIGO ====================
            "/api/v1/frigo": {
                get: {
                    tags: ["GestioneAlimentoController"],
                    summary: "Elenco completo degli alimenti nel frigo",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: "Elenco degli alimenti dell'utente",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            alimenti: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Alimento" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        401: { description: "Token mancante" },
                        403: { description: "Token non valido o scaduto" },
                        500: { description: "Errore interno del server" },
                    },
                },
            },

            "/api/v1/frigo/aggiungi": {
                post: {
                    tags: ["GestioneAlimentoController"],
                    summary: "Aggiunge un alimento al frigo",
                    description:
                        "Dopo il salvataggio emette l'evento Socket.io 'frigo-aggiornato' verso tutte le sessioni aperte dell'utente, che aggiornano la propria interfaccia in tempo reale.",
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": { schema: { $ref: "#/components/schemas/NuovoAlimentoRequest" } },
                        },
                    },
                    responses: {
                        201: {
                            description: "Alimento registrato",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/SuccessMessage" } },
                            },
                        },
                        400: { description: "Campi obbligatori mancanti" },
                        401: { description: "Token mancante" },
                        403: { description: "Token non valido o scaduto" },
                        500: { description: "Errore interno del server" },
                    },
                },
            },

            "/api/v1/frigo/{id}": {
                delete: {
                    tags: ["GestioneAlimentoController"],
                    summary: "Rimuove un alimento dal frigo",
                    description:
                        "L'eliminazione avviene solo se l'alimento appartiene all'utente autenticato. Emette poi l'evento Socket.io 'frigo-aggiornato'.",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "string" },
                            description: "Identificativo MongoDB dell'alimento",
                        },
                    ],
                    responses: {
                        200: {
                            description: "Alimento rimosso",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/SuccessMessage" } },
                            },
                        },
                        401: { description: "Token mancante" },
                        403: { description: "Token non valido o scaduto" },
                        404: { description: "Alimento non trovato o appartenente a un altro utente" },
                        500: { description: "Errore interno del server" },
                    },
                },
            },

            // ==================== SPESA ====================
            "/api/v1/spesa": {
                get: {
                    tags: ["SpesaController"],
                    summary: "Elenco della lista della spesa",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: "Elenco degli elementi in lista",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            lista: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Spesa" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        401: { description: "Token mancante" },
                        403: { description: "Token non valido o scaduto" },
                        500: { description: "Errore interno del server" },
                    },
                },
            },

            "/api/v1/spesa/aggiungi": {
                post: {
                    tags: ["SpesaController"],
                    summary: "Aggiunge un elemento alla lista della spesa",
                    description: "Emette l'evento Socket.io 'spesa-aggiornata' verso le sessioni dell'utente.",
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": { schema: { $ref: "#/components/schemas/NuovaSpesaRequest" } },
                        },
                    },
                    responses: {
                        201: {
                            description: "Elemento aggiunto",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            elemento: { $ref: "#/components/schemas/Spesa" },
                                        },
                                    },
                                },
                            },
                        },
                        400: { description: "Campi obbligatori mancanti" },
                        401: { description: "Token mancante" },
                        403: { description: "Token non valido o scaduto" },
                        500: { description: "Errore interno del server" },
                    },
                },
            },

            "/api/v1/spesa/{id}": {
                delete: {
                    tags: ["SpesaController"],
                    summary: "Rimuove un elemento dalla lista della spesa",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "string" },
                            description: "Identificativo MongoDB dell'elemento",
                        },
                    ],
                    responses: {
                        200: {
                            description: "Elemento rimosso",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/SuccessMessage" } },
                            },
                        },
                        401: { description: "Token mancante" },
                        403: { description: "Token non valido o scaduto" },
                        404: { description: "Elemento non trovato" },
                        500: { description: "Errore interno del server" },
                    },
                },
            },

            // ==================== CHATBOT ====================
            "/api/v1/chatbot/messaggio": {
                post: {
                    tags: ["ChatbotController"],
                    summary: "Invia un messaggio all'assistente virtuale",
                    description:
                        "Il client invia il testo e l'intera cronologia della conversazione, che il backend inoltra al modello Google Gemini. Lo storico non viene salvato lato server: vive solo nello stato del componente React.",
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": { schema: { $ref: "#/components/schemas/ChatbotRequest" } },
                        },
                    },
                    responses: {
                        200: {
                            description: "Risposta generata dall'assistente",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ChatbotResponse" } },
                            },
                        },
                        400: { description: "Messaggio vuoto" },
                        401: { description: "Token mancante" },
                        403: { description: "Token non valido o scaduto" },
                        500: { description: "Errore nella comunicazione con il modello AI" },
                    },
                },
            },
        },
    },

    // Percorsi da cui swagger-jsdoc estrarrebbe commenti in formato JSDoc.
    // Qui è vuoto perché la specifica è definita per intero nell'oggetto
    // "definition" sopra, come nell'esercitazione del corso.
    apis: [],
};

// Genera la specifica finale e la esporta per l'uso in server.js
const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;