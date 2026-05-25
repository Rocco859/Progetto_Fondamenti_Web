import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthPopups from './components/AuthPopups';
import MenuPulsanti from './components/MenuPulsanti'; // <-- Import aggiornato
import ChatbotWidget from './components/ChatbotWidget';
import AddAlimento from './components/AddAlimento';
import AlimentiInScadenza from './components/AlimentiInScadenza';

import './App.css';

function App() {
    // 1. STATO LOGIN: false = ospite, true = utente loggato
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // 2. STATO POPUP: null = chiuso, 'login' = mostra login, 'register' = mostra registrazione
    const [activePopup, setActivePopup] = useState(null); 

    return (
        <div className="app-container">
            {/* PASSAGGIO PROPS ALLA NAVBAR */}
            <Navbar 
                isLoggedIn={isLoggedIn} 
                setIsLoggedIn={setIsLoggedIn} 
                onOpenPopup={setActivePopup} 
            />
            <div className="layout-schermo-intero">
                <div className="sezione-centrale">
            <div className='add-container'>
                <main className="main-content">
                <AddAlimento 
                    isLoggedIn={isLoggedIn} 
                    onOpenPopup={setActivePopup} 
                />
                </main>
            </div>

            {/* CORPO PRINCIPALE DELLA PAGINA */}
            <main className="welcome-container">
                <div  className="welcome-message">
                    <h2 className="welcome-title">Benvenuto su Fridgy 🍎</h2>
                    <p>
                        Stato attuale del sito: {isLoggedIn ? "🟢 Sei dentro! (Utente Loggato)" : "🔴 Sei fuori (Ospite)"}
                    </p>
                    
                    {/* I BOTTONI ORA SONO SEMPRE VISIBILI A TUTTI */}
                    {/* Passiamo al componente le informazioni che gli servono per fare il "buttafuori" */}
                    <MenuPulsanti 
                        isLoggedIn={isLoggedIn} 
                        onOpenPopup={setActivePopup} 
                    />

                </div>
            </main>
                </div>
                <AlimentiInScadenza />
            </div>

            {/* MOSTRA I POPUP (L'animazione è gestita dal CSS tramite il type) */}
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