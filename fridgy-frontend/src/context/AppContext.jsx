import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import BASE_URL from '../config';


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
                const payloadDecoded = JSON.parse(atob(tokenSalvato.split('.')[1]));
                setNomeUtente(payloadDecoded.nome || "Utente");
            } catch (error) {
                console.error("Errore nella decodifica del token:", error);
            }
        } else {
            setNomeUtente("");
        }
    }, [isLoggedIn]);


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

        socket.on('connect', () => {
            console.log('Connesso al server in tempo reale');
        });

        socket.on('connect_error', (err) => {
            console.error('Errore connessione real-time:', err.message);
        });

        socket.on('frigo-aggiornato', () => {
            console.log('Frigo aggiornato in tempo reale');
            setRefreshTrigger(prev => !prev);
            //notifica unica per tutte le sessioni dell'utente, compresa quella
            //che ha fatto la modifica. Testo generico perché lo stesso evento
            //viene emesso sia per l'aggiunta che per la rimozione
            aggiungiMessaggio("Frigo aggiornato");
        });

        socket.on('spesa-aggiornata', () => {
            console.log('🛒 Lista della spesa aggiornata in tempo reale');
            setRefreshTrigger(prev => !prev);
            aggiungiMessaggio("Lista della spesa aggiornata");
        });

        return () => {
            socket.disconnect();
        };
    }, [isLoggedIn]);


    const DURATA_MESSAGGIO = 4000;

    const aggiungiMessaggio = (testo) => {
        const nuovoMessaggio = { id: `${Date.now()}-${Math.random()}`, testo: testo };
        setMessaggiNonLetti(precedenti => [...precedenti, nuovoMessaggio]);

        setTimeout(() => {
            setMessaggiNonLetti(precedenti =>
                precedenti.filter(m => m.id !== nuovoMessaggio.id)
            );
        }, DURATA_MESSAGGIO);
    };


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
        setNomeUtente,
        activePopup,
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