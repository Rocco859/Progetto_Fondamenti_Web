import React, { useState } from 'react';
import BASE_URL from '../config';
import './AddAlimento.css';
import { useAppContext } from '../context/AppContext';

function AddAlimento() {
    const { isLoggedIn, setActivePopup, setRefreshTrigger, aggiungiMessaggio } = useAppContext();
    const [nomeAlimento, setNomeAlimento] = useState('');
    const [quantitaAlimento, setQuantitaAlimento] = useState('');
    const [scadenzaAlimento, setScadenzaAlimento] = useState('');


    const handleAggiungiAlimento = async (e) => {
        // 1. Blocchiamo subito il refresh del browser
        e.preventDefault();
        try {
            // 2. Recuperiamo il token dell'utente dal localStorage
            const token = localStorage.getItem('tokenFridgy');
            const response = await fetch(`${BASE_URL}/api/v1/frigo/aggiungi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nomeAlimento: nomeAlimento,
                    quantitaAlimento: quantitaAlimento,
                    scadenzaAlimento: scadenzaAlimento
                })
            });
            const data = await response.json();
            if (data.success) {
                // Aggiorni la lista a schermo senza ricaricare la pagina!
                aggiungiMessaggio("Alimento aggiunto al frigo!");
                setNomeAlimento('');
                setQuantitaAlimento('');
                setScadenzaAlimento('');
                setRefreshTrigger(prev => !prev); // Avvisa MenuPulsanti e AlimentiInScadenza di ricaricare
            } else { 
                aggiungiMessaggio("Errore: " + data.message);
            }
        } catch (error) {
            console.error("Errore nell'aggiunta:", error);
        }
    };

    const handleClickAddAlimento = (e) => {
        e.preventDefault(); // Evita il ricaricamento automatico della pagina
        if (isLoggedIn) {
            // Se è loggato, aggiunge l'alimento al DB
            handleAggiungiAlimento(e);
        } else {
            setActivePopup('login'); // Se è ospite, apre il popup di accesso
        }
    };

    return (<div className="layout-principale">

        <div className="colonna-sinistra">
            <form className="quick-add-bar" onSubmit={handleClickAddAlimento}>

                <button type="submit" className="btn-add" aria-label="Aggiungi alimento">+</button>

                <label htmlFor="nomeAlimento" className="sr-only">Nome alimento</label>
                <input
                    type="text" id="nomeAlimento" name="nomeAlimento" placeholder="AGGIUNGI ALIMENTO" value={nomeAlimento} onChange={(e) => setNomeAlimento(e.target.value)} required
                />
                <label htmlFor="quantitaAlimento" className="sr-only">Quantità</label>
                <input
                    type="number" id="quantitaAlimento" name="quantitaAlimento" placeholder="QUANTITÀ" value={quantitaAlimento} onChange={(e) => setQuantitaAlimento(e.target.value)} required
                />

                <label htmlFor="data-scadenza" className="sr-only">Data di scadenza</label>
                <input type="date" id="data-scadenza" value={scadenzaAlimento} onChange={(e) => setScadenzaAlimento(e.target.value)} name="data-scadenza"
                />

            </form>
        </div>
    </div>)
}
export default AddAlimento;