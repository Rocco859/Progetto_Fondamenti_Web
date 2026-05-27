import React, { useState, useEffect } from 'react';
import './BannerNotifiche.css';

function BannerNotifiche({ isLoggedIn, nomeUtente }) {
    const [notifiche, setNotifiche] = useState(null);
    const [mostraBanner, setMostraBanner] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            const datiSimulati = {
                urgenti: [{ nome: 'Latte Intero', giorni: 2 }],
                imminenti: [{ nome: 'Uova Fresche', giorni: 5 }]
            };
            setNotifiche(datiSimulati);
            setMostraBanner(true);
        } else {
            setMostraBanner(false);
            setNotifiche(null);
        }
    }, [isLoggedIn]);

    if (!mostraBanner || !notifiche) {
        return null;
    }

    return (
        <div className="banner-notifiche">
            <div className="banner-contenuto">
                <h3>🔔 Ciao {nomeUtente}, hai alimenti in scadenza!</h3>
                
                {notifiche.urgenti.length > 0 && (
                    <p className="testo-urgente">
                        🔴 <strong>Urgente (meno di 3 gg):</strong> {notifiche.urgenti.map(a => a.nome).join(', ')}
                    </p>
                )}
                
                {notifiche.imminenti.length > 0 && (
                    <p className="testo-imminente">
                        🟡 <strong>Attenzione (meno di 7 gg):</strong> {notifiche.imminenti.map(a => a.nome).join(', ')}
                    </p>
                )}
            </div>
            <button className="btn-chiudi-banner" onClick={() => setMostraBanner(false)}>
                Ok, ho capito!
            </button>
        </div>
    );
}

export default BannerNotifiche;