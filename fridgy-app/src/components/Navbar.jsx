import { useState } from 'react';
import './Navbar.css';
import { useAppContext } from '../context/AppContext';

function Navbar() {
    const { isLoggedIn, nomeUtente, setActivePopup, handleLogout } = useAppContext(); //estrazione dal context*/
    const [isMenuOpen, setIsMenuOpen] = useState(false); //stato locale

    return (
        <nav className="navbar-container">
            {/*parte sinistra (manca il logo)*/}
            <div className="section-sx">
                <section className="logo">
                    <img src="/logo-app.png" alt="" className="logo-icon" />
                    <h1>Fridgy</h1>
                </section>
            </div>

            {/*se non loggato*/}
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

            {/*utente loggato*/}
            {isLoggedIn && (
                <div className='section-dx'>
                    <div className='accesso-eff' onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span className="nomeutente"> Benvenuto, {nomeUtente}</span>
                        <button className="btn-hamburger">☰</button>
                    </div>
                </div>
            )}

            {/*menu a tendina*/}
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