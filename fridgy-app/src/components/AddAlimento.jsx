import React, { useState } from 'react';
import BASE_URL from '../config';
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
            //recupero token  dal localstoreg
            const token = localStorage.getItem('tokenFridgy');

            //chiamata http al backend per aggiungere l'alimento
            const response = await fetch(`${BASE_URL}/api/v1/frigo/aggiungi`, {
                //header
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                //payload
                body: JSON.stringify({
                    nomeAlimento: nomeAlimento,
                    quantitaAlimento: quantitaAlimento,
                    scadenzaAlimento: scadenzaAlimento
                })
            });


            const data = await response.json();  //converte la risposta del server da json a oggetto js
            
            if (data.success) {
                aggiungiMessaggio("Alimento aggiunto al frigo!"); //notifica di aggiunta
                setNomeAlimento('');
                setQuantitaAlimento('');
                setScadenzaAlimento('');
                setRefreshTrigger(prev => !prev); //fa ricaricare MenuPulsanti e AlimentiInScadenza
            } else { 
                aggiungiMessaggio("Errore: " + data.message);
            }
        } catch (error) {
            console.error("Errore nell'aggiunta:", error);
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