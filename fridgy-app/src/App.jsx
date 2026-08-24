import React from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import AuthPopups from './components/AuthPopups';
import MenuPulsanti from './components/MenuPulsanti';
import ChatbotWidget from './components/ChatbotWidget';
import AddAlimento from './components/AddAlimento';
import AlimentiInScadenza from './components/AlimentiInScadenza';
//import BannerNotifiche from './components/BannerNotifiche';
import './App.css';
import { useAppContext } from './context/AppContext';
import MessaggiNonLetti from './components/MessaggiNonLetti';

// ─────────────────────────────────────────────
// AppShell: contiene il layout e legge dal context
// Separato da App per poter usare useAppContext()
// (il Provider deve avvolgere chi usa il context)
// ─────────────────────────────────────────────
function AppShell() {
    const { isLoggedIn, nomeUtente, setActivePopup } = useAppContext();

    return (
        <div className="app-container">
            <Navbar />
            <MessaggiNonLetti />

            

            {/* <BannerNotifiche /> */}

            <div className="layout-schermo-intero">
                <div className="sezione-centrale">
                    {isLoggedIn ? (
                        <>
                            <div className='add-container'>
                                <main className="main-content">
                                    <AddAlimento />
                                </main>
                            </div>

                            <main className="welcome-container">
                                <div className="welcome-message">
                                    <h2 className="welcome-title">Benvenuto {nomeUtente} su Fridgy 🍎</h2>
                                    
                                    <MenuPulsanti/>
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
                <AlimentiInScadenza />
            </div>

            <AuthPopups />

            <ChatbotWidget />
        </div>
    );
}

// ─────────────────────────────────────────────
// App: il punto di ingresso.
// Avvolge tutto con AppProvider così tutti i figli
// possono leggere il context con useAppContext()
// ─────────────────────────────────────────────
function App() {
    return (
        <AppProvider>
            <AppShell />
        </AppProvider>
    );
}

export default App;