import React, { useState, useEffect } from 'react';
import './AlimentiInScadenza.css';

const AlimentiInScadenza = () => {
    /*Definizione degli stati*/
    const [alimenti, setAlimenti] = useState([]); /*array vuoto che conterrà gli alimenti prelervati da mongodb */
    
    useEffect(() => {
        fetch('http://localhost:5000/api/alimenti-scadenza') /*chiamata al backend per ottenere gli alimenti in scadenza*/
        .then(response =>{   /*Verifica della risposta del server*/

            if (!response.ok) {
                throw new Error("Errore nella risposta del server");
            }
            return response.json();
        })
        .then(data => {
            setAlimetni(data);
        })
        .catch(error => {
            console.error("Errore nel caricamento dei dati dal server:", error);

        });
    }, []); 

    return (
        <aside id="alimenti-scadenza-widget" className="sidebar-scadenza">
            <h3 className = "titolo-scadenza">Alimenti in Scadenza</h3>

            <div className="lista-scadenza-conteiner">
                {alimenti.length === 0 ? (
                    <p className="nessun-alimento">Nessun alimento in scadenza</p>
                ) : (
                    alimenti.map(alimento => {
                        const grave = alimento.giorniMancanti <= 3;
                        const classePericolo = grave ? "Pericolo-rosso" : "Pericolo-giallo";
                        const iconaPericolo = grave ? "bi-exclamation-triangle" : "bi-triangle";

                        return (
                            <div key={alimento.id} className = "item-scadenza">
                                <i className={`bi ${iconaPericolo} ${classePericolo}`}></i>

                                <div className = "item-centro">
                                    <span className = "nome-alimento"> {alimento.nome} </span>
                                    <span className = "giorni-rimasti"> {alimento.giorniMancanti} giorni alla scadenza </span>
                                </div>

                                <input 
                                    type="checkbox" 
                                    className="casella-rimozione"
                                    /*onChange={() => handleRimuovi(alimento._id)}*/ 
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </aside>
    );
};

export default AlimentiInScadenza;
