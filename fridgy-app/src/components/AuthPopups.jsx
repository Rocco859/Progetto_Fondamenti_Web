import React, { useState } from 'react';
import './AuthPopups.css';
import BASE_URL from '../config';
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
    const [codiceFiscale, setCodiceFiscale] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confermaPassword, setConfermaPassword] = useState('')

    const handleRegister = async (e) => {
        e.preventDefault();  //blocca il reload della pagina

        if (password !== confermaPassword) {
            aggiungiMessaggio("Le password non corrispondono!");
            return;
        }

        try {

            //chiamata http all endpoint della registrazione
            const response = await fetch(`${BASE_URL}/api/v1/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: nome,
                    cognome: cognome,
                    codiceFiscale: codiceFiscale,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();
            if (data.success) {                                     //se la registrazione ha successo mostra il messaggio di conferma
                aggiungiMessaggio(data.message);                    //salva il token, aggiorna lo stato globale e chiude il popup
                localStorage.setItem('tokenFridgy', data.token);
                setIsLoggedIn(true);
                onClose();
            } else {
                aggiungiMessaggio("Errore: " + data.message);
            }
        } catch (error) {
            console.error("Errore di connessione al server:", error);
            aggiungiMessaggio("Impossibile contattare il server. Riprova più tardi.");
        }
    };


    //più o meno come register
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/api/v1/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            });

            const data = await response.json();
            if (data.success) {
                aggiungiMessaggio(data.message);
                localStorage.setItem('tokenFridgy', data.token);
                setIsLoggedIn(true);
                onClose();
            } else {
                aggiungiMessaggio("Errore: " + data.message);
            }
        } catch (error) {
             console.error("Errore di connessione al server:", error);
            aggiungiMessaggio("Impossibile contattare il server. Riprova più tardi.");
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
                    <input type="text" id="codiceFiscale" className="input-logreg" placeholder="Codice Fiscale" minLength="16" value={codiceFiscale} onChange={(e) => setCodiceFiscale(e.target.value)} maxLength="16" required />
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