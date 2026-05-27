import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthPopups from './components/AuthPopups';
import MenuPulsanti from './components/MenuPulsanti'; 
import ChatbotWidget from './components/ChatbotWidget';
import AddAlimento from './components/AddAlimento';
import AlimentiInScadenza from './components/AlimentiInScadenza';
import BannerNotifiche from './components/BannerNotifiche'; // <-- 1. IMPORTIAMO IL BANNER
import './App.css';

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
            <BannerNotifiche 
                isLoggedIn={isLoggedIn} 
                nomeUtente={nomeUtente} 
            />

            <div className="layout-schermo-intero">
                <div className="sezione-centrale">
                    {isLoggedIn ? (
                        <>
                            <div className='add-container'>
                                <main className="main-content">
                                    <AddAlimento 
                                        isLoggedIn={isLoggedIn} 
                                        onOpenPopup={setActivePopup} 
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

                <AlimentiInScadenza />
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