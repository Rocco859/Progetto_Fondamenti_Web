import React, { useState } from 'react';
import { frigo } from '../services/api';
import './AddAlimento.css';
import { useAppContext } from '../context/AppContext';

function AddAlimento() {
    //estrae le quatro componenti nelle graffe dal context
    const { isLoggedIn, setActivePopup, setRefreshTrigger, aggiungiMessaggio } = useAppContext();

    //variabili di stato locali
    const [nomeAlimento, setNomeAlimento] = useState('');
    const [quantitaAlimento, setQuantitaAlimento] = useState('');
    const [scadenzaAlimento, setScadenzaAlimento] = useState('');


    const handleAggiungiAlimento = async (e) => {
        
        e.preventDefault();  //no refresh browser
        try {
            // Una riga sola: il token e gli header li mette api.js
            const data = await frigo.aggiungi(nomeAlimento, quantitaAlimento, scadenzaAlimento);

            aggiungiMessaggio("Alimento aggiunto al frigo!");
            setNomeAlimento('');
            setQuantitaAlimento('');
            setScadenzaAlimento('');
            setRefreshTrigger(prev => !prev); //fa ricaricare MenuPulsanti e AlimentiInScadenza

        } catch (error) {
            // Prima c'era un "else" per l'errore del server e un "catch"
            // per l'errore di rete. Ora api.js lancia un'eccezione in
            // entrambi i casi, quindi basta un solo blocco
            console.error("Errore nell'aggiunta:", error);
            aggiungiMessaggio("Errore: " + error.message);
        }
    };


    const handleClickAddAlimento = (e) => {
        e.preventDefault(); // Evita il ricaricamento automatico della pagina
        
        if (isLoggedIn) {     //se è loggato agginge l alimento al db
            handleAggiungiAlimento(e);
        } else {
            setActivePopup('login'); //se è ospite apre il login
        }
    };



    return (<div className="layout-principale">

        <div className="colonna-sinistra">
            <form className="quick-add-bar" onSubmit={handleClickAddAlimento}> {/*il form si attiva se l'utente clicca il bottone o preme invio */}

                <button type="submit" className="btn-add" aria-label="Aggiungi alimento">+</button>


                <label htmlFor="nomeAlimento" className="sr-only">Nome alimento</label> {/*accessibilità*/}
                
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