import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import BASE_URL from '../config';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const tokenSalvato = localStorage.getItem('tokenFridgy');
        return Boolean(tokenSalvato);
    });

    const [nomeUtente, setNomeUtente] = useState("");
    const [activePopup, setActivePopup] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    // Decodifica nome utente dal token JWT
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

    // Gestione Socket.IO per aggiornamenti in tempo reale
    useEffect(() => {
        if (!isLoggedIn) return;

        const token = localStorage.getItem('tokenFridgy');
        if (!token) return;

        const socket = io(BASE_URL, {
            auth: { token }
        });

        socket.on('connect', () => {
            console.log('🔌 Connesso al server in tempo reale');
        });

        socket.on('connect_error', (err) => {
            console.error('Errore connessione real-time:', err.message);
        });

        socket.on('frigo-aggiornato', () => {
            console.log('📦 Frigo aggiornato in tempo reale');
            setRefreshTrigger(prev => !prev);
        });

        socket.on('spesa-aggiornata', () => {
            console.log('🛒 Lista della spesa aggiornata in tempo reale');
            setRefreshTrigger(prev => !prev);
        });

        return () => {
            socket.disconnect();
        };
    }, [isLoggedIn]);

    // Funzione di logout globale
    const handleLogout = () => {
        localStorage.removeItem('tokenFridgy');
        setIsLoggedIn(false);
        alert("Disconnessione effettuata! 👋");
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
        handleLogout
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
