import React, { useState } from 'react';
import './Navbar.css';

function Navbar({ isLoggedIn, setIsLoggedIn, onOpenPopup, nomeUtente, onLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
       <nav className="navbar-container">
            {/* PARTE SINISTRA: LOGO */}
            <div className="section-sx">
                <section className="logo">
                    <h1>Fridgy</h1>
                </section>
            </div>

            {/* SE NON È LOGGATO */}
            {!isLoggedIn && (
                <div className="sectionnolog-dx">
                    <ul className="btn-accreg-nav">
                        <li>
                            <a href="#" className="link-nav" onClick={(e) => { e.preventDefault(); onOpenPopup('login'); }}>
                                Accedi
                            </a>
                        </li>
                        <li>
                            <a href="#" className="link-nav" onClick={(e) => { e.preventDefault(); onOpenPopup('register'); }}>
                                Registrati
                            </a>
                        </li>
                    </ul>
                </div>
            )}

            {/* SE È LOGGATO */}
            {isLoggedIn && (
                <div className='section-dx'>
                    <div className='accesso-eff' onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        
                        <span className="nomeutente"> Benvenuto, {nomeUtente}</span>
                        <button className="btn-hamburger">☰</button>
                    </div>
                </div>
            )}

            {/* MENU A TENDINA 
                Rimosso il tag <aside>! Ora il div è libero di galleggiare 
                con il suo "position: absolute" senza rompere il Flexbox.
            */}
            {isLoggedIn && isMenuOpen && (
                <div className="menu-tendina aperta">
                    <a href="#" onClick={(e) => { e.preventDefault(); handleClickFrigo(); }}>Il mio Frigo</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleClickSpesa();}}>Lista della Spesa</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); }}>Ricette</a>
                    <hr /> 
                    <a href="#" className="testo-rosso" onClick={(e) => { 
                        e.preventDefault(); 
                        onLogout(); 
                        setIsMenuOpen(false); 
                    }}>
                        Esci
                    </a>
                </div>
            )}
       </nav>
    );
}

export default Navbar;