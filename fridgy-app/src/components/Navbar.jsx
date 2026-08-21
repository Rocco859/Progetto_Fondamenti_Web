import React, { useState } from 'react';
import './Navbar.css';
import { useAppContext } from '../context/AppContext';

function Navbar() {
    const { isLoggedIn, nomeUtente, setActivePopup, handleLogout } = useAppContext();
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
                            <a href="#" className="link-nav" onClick={(e) => { e.preventDefault(); setActivePopup('login'); }}>
                                Accedi
                            </a>
                        </li>
                        <li>
                            <a href="#" className="link-nav" onClick={(e) => { e.preventDefault(); setActivePopup('register'); }}>
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
                    <a href="#" className="testo-rosso" onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
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