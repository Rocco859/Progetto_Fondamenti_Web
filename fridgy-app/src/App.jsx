import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthPopups from './components/AuthPopups';
import MenuPulsanti from './components/MenuPulsanti'; 
import ChatbotWidget from './components/ChatbotWidget';
import AddAlimento from './components/AddAlimento';
import AlimentiInScadenza from './components/AlimentiInScadenza';
//import BannerNotifiche from './components/BannerNotifiche'; // 
import './App.css';
import {io} from 'socket.io-client';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const tokenSalvato = localStorage.getItem('tokenFridgy');
        return tokenSalvato ? true : false; 
    });
    
    const [nomeUtente, setNomeUtente] = useState("");

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

    const [activePopup, setActivePopup] = useState(null); 

    // 3. STATO AGGIORNAMENTO: Si attiva quando aggiungi un nuovo alimento e avvisa gli altri componenti
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) return;

        const token = localStorage.getItem('tokenFridgy');
        if (!token) return;

        const socket = io('http://localhost:3000', {
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

        return () => {
            socket.disconnect();
        };
    }, [isLoggedIn]);

    

    // 3. FUNZIONE DI LOGOUT: Cancella il token e resetta lo stato
    const handleLogout = () => {
        localStorage.removeItem('tokenFridgy');
        setIsLoggedIn(false);
        alert("Disconnessione effettuata! 👋");
    };

    return (
        <div className="app-container">
            <Navbar 
                isLoggedIn={isLoggedIn} 
                setIsLoggedIn={setIsLoggedIn} 
                nomeUtente={nomeUtente}
                onOpenPopup={setActivePopup} 
                onLogout={handleLogout} 
            />
            
            {/* 2. INSERIAMO IL BANNER QUI, PASSANDOGLI I DATI */}
       {/*     <BannerNotifiche 
                isLoggedIn={isLoggedIn} 
                nomeUtente={nomeUtente} 
            />  */}

            <div className="layout-schermo-intero">
                <div className="sezione-centrale">
                    {isLoggedIn ? (
                        <>
                            <div className='add-container'>
                                <main className="main-content">
                                    <AddAlimento 
                                        isLoggedIn={isLoggedIn} 
                                        onOpenPopup={setActivePopup} 
                                        onAddSuccess={() => setRefreshTrigger(prev => !prev)}
                                    />
                                </main>
                            </div>

                            <main className="welcome-container">
                                <div className="welcome-message">
                                    <h2 className="welcome-title">Benvenuto {nomeUtente} su Fridgy 🍎</h2>
                                    <p>Stato attuale del sito: 🟢 Sei dentro! (Utente Loggato)</p>
                                    <MenuPulsanti 
                                        isLoggedIn={isLoggedIn} 
                                        onOpenPopup={setActivePopup} 
                                        refreshTrigger={refreshTrigger}
                                    />
                                </div>
                            </main>
                        </>
                    ) : (
                        <main className="welcome-container">
                            <div className="welcome-message">
                                <h2 className="welcome-title">Benvenuto su Fridgy 🍎</h2>
                                <p>Stato attuale del sito: 🔴 Sei fuori (Ospite)</p>
                                <p className="login-notice">Effettua l'accesso o registrati per iniziare a gestire il tuo frigo!</p>
                                <div className="landing-buttons">
                                    <button className="btn-logreg" onClick={() => setActivePopup('login')}>Accedi</button>
                                    <button className="btn-logreg" onClick={() => setActivePopup('register')}>Registrati</button>
                                </div>
                            </div>
                        </main>
                    )}
                </div>

                {/* MOSTRA GLI ALIMENTI IN SCADENZA */}
                <AlimentiInScadenza isLoggedIn={isLoggedIn} refreshTrigger={refreshTrigger} />
            </div>

            <AuthPopups 
                type={activePopup} 
                onClose={() => setActivePopup(null)}
                setIsLoggedIn={setIsLoggedIn}
            />
            
            <ChatbotWidget />
        </div>
    );
}

export default App;