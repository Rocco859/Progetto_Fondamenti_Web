import { useState } from 'react';
import './AuthPopups.css';
import { auth } from '../services/api';
import { useAppContext } from '../context/AppContext';

function AuthPopups() {
    //estrazione dal context
    const { activePopup, setActivePopup, setIsLoggedIn, aggiungiMessaggio } = useAppContext();
    const type = activePopup;                        // alias leggibile
    const onClose = () => setActivePopup(null);      // chiude il popup
    const isVisible = type !== null;  // se type è diverso da null allora il booleano isVisible è true
    
    //variabili di stato locali
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confermaPassword, setConfermaPassword] = useState('')

    //register
    const handleRegister = async (e) => {
        e.preventDefault();  //blocca il reload della pagina

        if (password !== confermaPassword) {
            aggiungiMessaggio("Le password non corrispondono!");
            return;
        }

                try {
            const data = await auth.registra(nome, cognome, email, password);
            aggiungiMessaggio(data.message);
            localStorage.setItem('tokenFridgy', data.token);
            setIsLoggedIn(true);
            onClose();  

        } catch (error) {
            console.error("Errore nella registrazione:", error);
            aggiungiMessaggio("Errore: " + error.message);
        }
    };


    //login
    const handleLogin = async (e) => {
        e.preventDefault();
                try {
            const data = await auth.accedi(email, password);

            aggiungiMessaggio(data.message);
            localStorage.setItem('tokenFridgy', data.token);
            setIsLoggedIn(true);
            onClose();

        } catch (error) {
            console.error("Errore nel login:", error);
            aggiungiMessaggio("Errore: " + error.message);
        }
    };

    return (
        <div className={`overlay ${isVisible ? 'visible' : ''}`}> {/*conteiner più esterno che oscura tutta la pagina in base al valore di isVisible */}

            {/*popup login*/}
            <div className={`login-popup ${type === 'login' ? 'visible' : ''}`}>
                <button className="btn-chiudi" onClick={onClose}>X</button>
                <h2>Accedi al tuo account</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" className="input-logreg" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" className="input-logreg" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="btn-logreg">Accedi</button>
                </form>
            </div>

            {/*popup registrazione*/}
            <div className={`logreg-popup ${type === 'register' ? 'visible' : ''}`}>
                <button className="btn-chiudi" onClick={onClose}>X</button>
                <h2>Registrati</h2>
                <form onSubmit={handleRegister}>
                    <input type="text" id="Nome" className="input-logreg" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    <input type="text" id="Cognome" className="input-logreg" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
                    <input type="email" id="email" className="input-logreg" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" id="Password" className="input-logreg" placeholder="Password" minLength="8" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <input type="password" id="ConfermaPassword" className="input-logreg" placeholder="Conferma Password" minLength="8" value={confermaPassword} onChange={(e) => setConfermaPassword(e.target.value)} required />
                    <button type="submit" className="btn-logreg" id="submit">Registrati</button>
                </form>
            </div>

        </div>
    );
}

export default AuthPopups;