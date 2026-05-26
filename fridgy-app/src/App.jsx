import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthPopups from './components/AuthPopups';
import MenuPulsanti from './components/MenuPulsanti'; 
import ChatbotWidget from './components/ChatbotWidget';
import AddAlimento from './components/AddAlimento';
import AlimentiInScadenza from './components/AlimentiInScadenza';
import './App.css';

function App() {
    // 1. STATO LOGIN AGGIORNATO: Controlla se c'è un token salvato nel browser al caricamento
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const tokenSalvato = localStorage.getItem('tokenFridgy');
        return tokenSalvato ? true : false; 
    });
    
    // 1.5. STATO NOME UTENTE: Recuperato decodificando il Token JWT
    const [nomeUtente, setNomeUtente] = useState("");

    // Decodifica il token ogni volta che isLoggedIn cambia (in caso di login o logout)
    useEffect(() => {
        const tokenSalvato = localStorage.getItem('tokenFridgy');
        if (isLoggedIn && tokenSalvato) {
            try {
                const payloadDecoded = JSON.parse(atob(tokenSalvato.split('.')[1])); // atob decodifica il payload in base64
                setNomeUtente(payloadDecoded.nome || "Utente");
            } catch (error) {
                console.error("Errore nella decodifica del token:", error);
            }
        } else {
            setNomeUtente("");
        }
    }, [isLoggedIn]);

    // 2. STATO POPUP: null = chiuso, 'login' = mostra login, 'register' = mostra registrazione
    const [activePopup, setActivePopup] = useState(null); 

    // 3. FUNZIONE DI LOGOUT: Cancella il token e resetta lo stato
    const handleLogout = () => {
        localStorage.removeItem('tokenFridgy');
        setIsLoggedIn(false);
        alert("Disconnessione effettuata! 👋");
    };

    return (
        <div className="app-container">
            {/* PASSAGGIO PROPS ALLA NAVBAR (Aggiunta la funzione handleLogout) */}
            <Navbar 
                isLoggedIn={isLoggedIn} 
                setIsLoggedIn={setIsLoggedIn} 
                nomeUtente={nomeUtente}
                onOpenPopup={setActivePopup} 
                onLogout={handleLogout} // <-- Nuova prop utile per il tasto Esci
            />
            
            {/* LAYOUT AGGIUNTO DAL COLLEGA */}
            <div className="layout-schermo-intero">
                <div className="sezione-centrale">
                    {/* MOSTRIAMO LA BARRA DI AGGIUNTA E IL MENU SOLO SE L'UTENTE È LOGGATO */}
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
                        /* SCHERMATA SE SEI FUORI (OSPITE) */
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
                <AlimentiInScadenza />
            </div>

            {/* MOSTRA I POPUP */}
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
