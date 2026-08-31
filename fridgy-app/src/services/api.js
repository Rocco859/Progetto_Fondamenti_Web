import BASE_URL from '../config';

// ─────────────────────────────────────────────────────────────
// FUNZIONE CENTRALE
// Tutte le chiamate passano da qui: è l'unico punto del frontend
// che sa come si parla col backend (URL, header, token, parsing).
// Se domani cambia il prefisso delle API o il formato del token,
// si modifica solo questa funzione invece di 11 punti sparsi.
// ─────────────────────────────────────────────────────────────
async function richiesta(percorso, opzioni = {}) {
    const token = localStorage.getItem('tokenFridgy');

    const headers = { ...opzioni.headers };

    // Content-Type serve solo quando c'è un body da inviare:
    // aggiungerlo a una GET è inutile e in alcuni casi fuorviante
    if (opzioni.body) {
        headers['Content-Type'] = 'application/json';
    }

    // Il token viene aggiunto automaticamente se presente.
    // Prima ogni componente doveva ricordarsi di farlo a mano:
    // bastava dimenticarlo una volta per avere un 401 misterioso
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const risposta = await fetch(`${BASE_URL}/api/v1${percorso}`, {
        ...opzioni,
        headers
    });

    const dati = await risposta.json();

    // Se lo status HTTP non è 2xx lanciamo un errore: così il
    // chiamante gestisce tutto in un solo catch, invece di
    // controllare separatamente response.ok e data.success
    if (!risposta.ok) {
        throw new Error(dati.message || `Errore HTTP ${risposta.status}`);
    }

    return dati;
}

// ─────────────────────────────────────────────────────────────
// AUTENTICAZIONE
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// FRIGO
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// LISTA DELLA SPESA
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// CHATBOT
// ─────────────────────────────────────────────────────────────
export const chatbot = {
    inviaMessaggio: (testo, cronologia) =>
        richiesta('/chatbot/messaggio', {
            method: 'POST',
            body: JSON.stringify({ testo, cronologia })
        })
};