
import React, { useState } from 'react';
import './AuthPopups.css';

function AuthPopups({ type, onClose, setIsLoggedIn }) {
   
    const isVisible = type !== null;
    
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [codiceFiscale, setCodiceFiscale] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confermaPassword, setConfermaPassword] = useState('')

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confermaPassword) {
            alert("Le password non corrispondono!");
            return;
        }
        try {
           const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Specifichiamo le chiavi identiche a come se le aspetta il backend destrutturato
            body: JSON.stringify({ 
                nome: nome, 
                cognome: cognome, 
                codiceFiscale: codiceFiscale, 
                email: email, 
                password: password 
            })
        });

            const data = await response.json();
            if (data.success) {
                alert(data.message);
                setIsLoggedIn(true);
                onClose();
            } else {
                alert("Errore: " + data.message);
            }
        } catch (error) {
            alert("Backend spento! Accendilo sulla porta 5000");
        }
    };

    return (
        <div className={`overlay ${isVisible ? 'visible' : ''}`}> 
            
            {/* POPUP DI LOGIN - Lo mostriamo solo se il tipo è login */}
            <div className={`login-popup ${type === 'login' ? 'visible' : ''}`}>
                <button className="btn-chiudi" onClick={onClose}>X</button>
                <h2>Accedi al tuo account</h2>
                <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); onClose(); }}>
                    <input type="text" className="input-logreg" placeholder="Username" required />
                    <input type="password" className="input-logreg" placeholder="Password" required />
                    <button type="submit" className="btn-logreg">Accedi</button>
                </form>
            </div>

            {/* POPUP DI REGISTRAZIONE - Lo mostriamo solo se il tipo è register */}
            <div className={`logreg-popup ${type === 'register' ? 'visible' : ''}`}>
                <button className="btn-chiudi" onClick={onClose}>X</button>
                <h2>Registrati</h2>
                <form onSubmit={handleRegister}>
                    <input type="text" id="Nome" className="input-logreg" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required /> 
                    <input type="text" id="Cognome" className="input-logreg" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
                    <input type="text" id="codiceFiscale" className="input-logreg" placeholder="Codice Fiscale" minLength="16"  value={codiceFiscale} onChange={(e) => setCodiceFiscale(e.target.value)} maxLength="16" required />
                    <input type="email" id="email" className="input-logreg" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" id="Password" className="input-logreg" placeholder="Password" minLength="8"value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <input type="password" id="ConfermaPassword" className="input-logreg" placeholder="Conferma Password" minLength="8" value={confermaPassword} onChange={(e) => setConfermaPassword(e.target.value)} required />
                    <button type="submit" className="btn-logreg" id="submit">Registrati</button>
                </form>
            </div>

        </div>
    ); 
}

export default AuthPopups;