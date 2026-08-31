//import
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import AuthPopups from './components/AuthPopups';
import MenuPulsanti from './components/MenuPulsanti';
import ChatbotWidget from './components/ChatbotWidget';
import AddAlimento from './components/AddAlimento';
import AlimentiInScadenza from './components/AlimentiInScadenza';
import './App.css';
import { useAppContext } from './context/AppContext';
import MessaggiNonLetti from './components/MessaggiNonLetti';


//Componente che contiene tutta la struttura visiva dell'app
function AppShell() {
    const { isLoggedIn, nomeUtente, setActivePopup } = useAppContext();

    return (

        <div className="app-container">


            <Navbar />
            <MessaggiNonLetti />


            <div className="layout-schermo-intero">
                <div className="sezione-centrale">
                    {/*rendering condizionale  */}
                    {isLoggedIn ? (
                         //ramo utente loggato
                         <main className="welcome-container">
                            <div className='add-container'>
                                
                                    <AddAlimento />
                               
                            </div>
                             

                            
                                <div className="welcome-message">
                                    <h2 className="welcome-title">Benvenuto {nomeUtente} su Fridgy</h2>
                                    
                                    <MenuPulsanti/>
                                </div>
                            </main>
                        
                    ) : (

                        //ramo utente non loggato
                        <main className="welcome-container">
                            <div className="welcome-message">
                                <h2 className="welcome-title">Benvenuto su Fridgy</h2>
                                <p>Stato attuale del sito: Sei fuori (Ospite)</p>
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

            <AuthPopups />

            <ChatbotWidget />
        </div>
    );
}


function App() {
    return (
        <AppProvider>
            <AppShell />
        </AppProvider>
    );
}

export default App;