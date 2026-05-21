import React, { useState } from 'react';
import './MenuPulsanti.css';

// 1. Aggiungiamo isLoggedIn e onOpenPopup tra le parentesi graffe
function MenuPulsanti({ isLoggedIn, onOpenPopup }) {
    const [isFrigoOpen, setIsFrigoOpen] = useState(false);
    const [isSpesaOpen, setIsSpesaOpen] = useState(false);

    const [listaSpesa, setListaSpesa] = useState([
        'Pane integrale',
        'Mele fuji (1kg)',
        'Acqua frizzante (6 bottiglie)',
        'Detersivo piatti'
    ]);
    
    const [nuovoAlimento, setNuovoAlimento] = useState('');

    const handleAggiungiSpesa = () => {
        if (nuovoAlimento.trim() !== '') {
            setListaSpesa([...listaSpesa, nuovoAlimento.trim()]);
            setNuovoAlimento(''); 
        }
    };

    // 2. Creiamo il "Buttafuori" per il Frigo
    const handleClickFrigo = () => {
        if (isLoggedIn) {
            setIsFrigoAOpen(true); // Se è loggato, apre il suo frigo
        } else {
            onOpenPopup('login'); // Se è ospite, apre il popup di accesso
        }
    };

    // 3. Creiamo il "Buttafuori" per la Spesa
    const handleClickSpesa = () => {
        if (isLoggedIn) {
            setIsSpesaOpen(true);
        } else {
            onOpenPopup('login');
        }
    };
    return (
        <div className="pulsanti-container">
            
            <div className="bottoni-container">
                {/* ORA USANO LE FUNZIONI COL BUTTAFUORI */}
                <button className="btn-card" onClick={handleClickFrigo}>
                    IL TUO<br />FRIGO
                </button>
                <button className="btn-card" onClick={handleClickSpesa}>
                    LISTA<br />SPESA
                </button>
            </div>
            {/* MODALE FRIGO */}
            {isFrigoOpen && (
                <div className="modale-overlay attivo" onClick={() => setIsFrigoOpen(false)}>
                    <div className="modale-contenuto" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-chiudi-dash" onClick={() => setIsFrigoOpen(false)}>✕</button>
                        
                        <h2>CONTENUTO FRIGO</h2>
                        
                        <ul className="lista-elementi">
                            <li>🍅 Pomodori (Scad: 25/05)</li>
                            <li>🥛 Latte Intero (Scad: 17/05)</li>
                            <li>🥚 Uova (Scad: 30/05)</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* MODALE SPESA */}
            {isSpesaOpen && (
                <div className="modale-overlay attivo" onClick={() => setIsSpesaOpen(false)}>
                    <div className="modale-contenuto" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-chiudi-dash" onClick={() => setIsSpesaOpen(false)}>✕</button>
                        
                        <h2>LISTA DELLA SPESA</h2>
                        
                        <div className="aggiungi-item-spesa">
                            <input 
                                type="text" 
                                placeholder="Nome alimento"
                                value={nuovoAlimento}
                                onChange={(e) => setNuovoAlimento(e.target.value)}
                            />
                            <button className="btn-scan" onClick={handleAggiungiSpesa}>
                                AGGIUNGI
                            </button>
                        </div>
                        
                        <ul className="lista-elementi">
                            {listaSpesa.map((item, index) => (
                                <li key={index}>🛒 {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

        </div>
    );
}

export default MenuPulsanti;