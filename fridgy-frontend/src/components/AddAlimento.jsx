import React, { useState } from 'react';
import { frigo } from '../services/api';
import './AddAlimento.css';
import { useAppContext } from '../context/AppContext';

function AddAlimento() {
    const { isLoggedIn, setActivePopup, setRefreshTrigger, aggiungiMessaggio } = useAppContext();

    //variabili di stato locali
    const [nomeAlimento, setNomeAlimento] = useState('');
    const [quantitaAlimento, setQuantitaAlimento] = useState('');
    const [scadenzaAlimento, setScadenzaAlimento] = useState('');


    const handleAggiungiAlimento = async (e) => {

        e.preventDefault();
        try {

            const data = await frigo.aggiungi(nomeAlimento, quantitaAlimento, scadenzaAlimento);

            setNomeAlimento('');
            setQuantitaAlimento('');
            setScadenzaAlimento('');
            setRefreshTrigger(prev => !prev);

        } catch (error) {

            console.error("Errore nell'aggiunta:", error);
            aggiungiMessaggio("Errore: " + error.message);
        }
    };


    const handleClickAddAlimento = (e) => {
        e.preventDefault();

        if (isLoggedIn) {
            handleAggiungiAlimento(e);
        } else {
            setActivePopup('login');
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
                    type="number" id="quantitaAlimento" min="1" name="quantitaAlimento" placeholder="QUANTITÀ" value={quantitaAlimento} onChange={(e) => setQuantitaAlimento(e.target.value)} required
                />

                <label htmlFor="data-scadenza" className="sr-only">Data di scadenza</label>

                <input type="date" id="data-scadenza" value={scadenzaAlimento} onChange={(e) => setScadenzaAlimento(e.target.value)} name="data-scadenza"
                />

            </form>
        </div>
    </div>)
}
export default AddAlimento;