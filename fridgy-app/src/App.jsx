import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthPopups from './components/AuthPopups';
import MenuPulsanti from './components/MenuPulsanti'; // <-- Import aggiornato
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

            
            {/* CORPO PRINCIPALE DELLA PAGINA */}
            <main className="main-content">
                <div style={{ textAlign: 'center', marginTop: '100px', color: '#3d3c3c' }}>
                    <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Benvenuto su Fridgy 🍎</h2>
                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
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

            {/* MOSTRA I POPUP (L'animazione è gestita dal CSS tramite il type) */}
            <AuthPopups 
                type={activePopup} 
                onClose={() => setActivePopup(null)}
                setIsLoggedIn={setIsLoggedIn}
            />
        </div>
    );
}

export default App;