import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import BASE_URL from '../config';

//crea il context
const AppContext = createContext(null);

export function AppProvider({ children }) {

    //stato che tiene traccia se l'utente è loggato
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const tokenSalvato = localStorage.getItem('tokenFridgy');
        return Boolean(tokenSalvato);
    });


    //inizializzazion di tutte le variabili necessarie
    const [nomeUtente, setNomeUtente] = useState("");
    const [activePopup, setActivePopup] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [messaggiNonLetti, setMessaggiNonLetti] = useState([]);

    // nome utente dal token JWT
    useEffect(() => {
        const tokenSalvato = localStorage.getItem('tokenFridgy');
        if (isLoggedIn && tokenSalvato) {
            try {
                const payloadDecoded = JSON.parse(atob(tokenSalvato.split('.')[1]));    //converte il jscon in un oggetto js e decodifica il token
                setNomeUtente(payloadDecoded.nome || "Utente");
            } catch (error) {
                console.error("Errore nella decodifica del token:", error);
            }
        } else {  //in caso di logout viene svuotato il nomeutente
            setNomeUtente("");
        }
    }, [isLoggedIn]);  //si riattiva ogni volta che lo stato del login cambia


    // gestione real time
    useEffect(() => {

        //controlli
        if (!isLoggedIn) return;

        const token = localStorage.getItem('tokenFridgy');
        if (!token) return;
        
        //apertura connessione verso il backend
        const socket = io(BASE_URL, {
            auth: { token }
        });

        //conferma connessione
        socket.on('connect', () => {
            console.log('Connesso al server in tempo reale');
        });

        //errore connessione
        socket.on('connect_error', (err) => {
            console.error('Errore connessione real-time:', err.message);
        });

        //listener per il frigo aggiornatp
        socket.on('frigo-aggiornato', () => {
            console.log('Frigo aggiornato in tempo reale');
            setRefreshTrigger(prev => !prev);
        });

        //listener per la spesa aggiornata
        socket.on('spesa-aggiornata', () => {
            console.log('🛒 Lista della spesa aggiornata in tempo reale');
            setRefreshTrigger(prev => !prev);
        });

        return () => {
            socket.disconnect();
        };
    }, [isLoggedIn]);  //si riattiva ogni volta che lo stato del login cambia

    /* Aggiunge un nuovo messaggio all'array*/
    const aggiungiMessaggio = (testo) => {
        const nuovoMessaggio = { id: Date.now(), testo: testo };
        setMessaggiNonLetti(precedenti => [...precedenti, nuovoMessaggio]);
    };

    /* Rimuove un messaggio dall'array quando l'utente lo "legge"*/
    const rimuoviMessaggio = (id) => {
        setMessaggiNonLetti(precedenti => precedenti.filter(m => m.id !== id)); //.filter crea un nuovo array invece di modificarlo
    };
    
    // Funzione di logout
    const handleLogout = () => {
        localStorage.removeItem('tokenFridgy');
        setIsLoggedIn(false);
        aggiungiMessaggio("Disconnessione effettuata!");
    };

    const value = {
        isLoggedIn,
        setIsLoggedIn,
        nomeUtente,
        setNomeUtente,         //oggetto che contine tutto il contesto che deve essere condiviso globalmente
        activePopup,           //oggetto che verra letto da chiunque chiami useAppContext
        setActivePopup,
        refreshTrigger,
        setRefreshTrigger,
        handleLogout,
        messaggiNonLetti,
        aggiungiMessaggio,
        rimuoviMessaggio
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext deve essere usato all\'interno di un AppProvider');
    }
    return context;
}

export default AppContext;
