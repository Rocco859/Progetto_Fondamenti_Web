import React from 'react';
import './MessaggiNonLetti.css';
import { useAppContext } from '../context/AppContext';

function MessaggiNonLetti() {
    const { messaggiNonLetti, rimuoviMessaggio} = useAppContext();
    if (messaggiNonLetti.length === 0) {
        return null; // Non mostrare nulla se non ci sono messaggi non letti
    }

    return(
        <div className="messaggi-contenitore">
            {messaggiNonLetti.map((messaggio) => (
                <div key={messaggio.id} className="messaggio-non-letto">
                    <span>{messaggio.testo}</span>
                    <button
                        className="btn-leggi-messaggio"
                        onClick={() => rimuoviMessaggio(messaggio.id)}
                    >
                        x
                    </button>
                </div>
            ))}
        </div>
    )
}

export default MessaggiNonLetti;