import React, { useState } from 'react';
import './AddAlimento.css';
function Add_alimento({ isLoggedIn, onOpenPopup, onAddSuccess })
{
     
        const [nomeAlimento, setNomeAlimento] = useState('');
        const [quantitaAlimento, setQuantitaAlimento] = useState('');
        const [scadenzaAlimento, setScadenzaAlimento] = useState('');


const handleAggiungiAlimento = async (e) => {
    // 1. Blocchiamo subito il refresh del browser
    e.preventDefault();
    try {
        // 2. Recuperiamo il token dell'utente dal localStorage
        const token = localStorage.getItem('tokenFridgy');
        const response = await fetch('http://localhost:3000/api/frigo/aggiungi', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                 nomeAlimento: nomeAlimento,
                 quantitaAlimento: quantitaAlimento,
                 scadenzaAlimento: scadenzaAlimento })
        });
    const data = await response.json();
        if (data.success) {
            // Aggiorni la lista a schermo senza ricaricare la pagina!
            alert("Alimento aggiunto al frigo!"); 
            if (onAddSuccess) onAddSuccess(); // Avvisa App.jsx di ricaricare le altre liste!
        }else{alert("Errore: " + data.message);}
    } catch (error) {
        console.error("Errore nell'aggiunta:", error);

    }
};
 const handleClickAddAlimento = (e) => {
        e.preventDefault(); // Evita il ricaricamento automatico della pagina
        if (isLoggedIn) {
             // Se è loggato, DOVREBBE AGGIUNGERE L ALIMENTO AL DB
             handleAggiungiAlimento(e);
        } else {
            onOpenPopup('login'); // Se è ospite, apre il popup di accesso
        }
    };
return( <div class="layout-principale">
    
    <div class="colonna-sinistra">
      <form class="quick-add-bar" action="#" method="POST">
        
        <button type="submit" class="btn-add" aria-label="Aggiungi alimento" onClick={handleClickAddAlimento}>+</button>
        
        <label for="nomeAlimento" value="nomeAlimento"class="sr-only">Nome alimento</label>
        <input 
          type="text" id="nomeAlimento" name="nomeAlimento" placeholder="AGGIUNGI ALIMENTO" onChange={(e) => setNomeAlimento(e.target.value)} required 
        />
         <label for="quantitaAlimento" class="sr-only">Quantità</label>
         <input 
          type="number" id="quantitaAlimento" name="quantitaAlimento" placeholder="QUANTITÀ" onChange={(e) => setQuantitaAlimento(e.target.value)} required 
        />

        <label for="data-scadenza" class="sr-only">Data di scadenza</label>
        <input type="date" id="data-scadenza" onChange={(e) => setScadenzaAlimento(e.target.value)} name="data-scadenza" 
        />

        
      </form>
    </div>
    </div>
)
}
export default Add_alimento;