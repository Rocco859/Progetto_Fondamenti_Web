import BASE_URL from '../config';

//tutte le chiamate al backend passano da qui
async function richiesta(percorso, opzioni = {}) {
    const token = localStorage.getItem('tokenFridgy');

    const headers = { ...opzioni.headers };

    // Content-Type serve solo quando c'è un body da inviare:
    // aggiungerlo a una GET è inutile
    if (opzioni.body) {
        headers['Content-Type'] = 'application/json';
    }

    // Il token viene aggiunto automaticamente se presente.
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const risposta = await fetch(`${BASE_URL}/api/v1${percorso}`, {
        ...opzioni,
        headers
    });

    const dati = await risposta.json();

    
    if (!risposta.ok) {
        throw new Error(dati.message || `Errore HTTP ${risposta.status}`);
    }

    return dati;
}

//autenticazione
export const auth = {
    registra: (nome, cognome, email, password) =>
        richiesta('/register', {
            method: 'POST',
            body: JSON.stringify({ nome, cognome, email, password })
        }),

    accedi: (email, password) =>
        richiesta('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        })
};

//frigo
export const frigo = {
    elenco: () =>
        richiesta('/frigo'),   // GET è il metodo di default di fetch

    inScadenza: () =>
        richiesta('/alimenti-scadenza'),

    aggiungi: (nomeAlimento, quantitaAlimento, scadenzaAlimento) =>
        richiesta('/frigo/aggiungi', {
            method: 'POST',
            body: JSON.stringify({ nomeAlimento, quantitaAlimento, scadenzaAlimento })
        }),

    elimina: (id) =>
        richiesta(`/frigo/${id}`, { method: 'DELETE' })
};

//spesa
export const spesa = {
    elenco: () =>
        richiesta('/spesa'),

    aggiungi: (nomeAlimento) =>
        richiesta('/spesa/aggiungi', {
            method: 'POST',
            body: JSON.stringify({ nomeAlimento })
        }),

    elimina: (id) =>
        richiesta(`/spesa/${id}`, { method: 'DELETE' })
};

//chatbot
export const chatbot = {
    inviaMessaggio: (testo, cronologia) =>
        richiesta('/chatbot/messaggio', {
            method: 'POST',
            body: JSON.stringify({ testo, cronologia })
        })
};