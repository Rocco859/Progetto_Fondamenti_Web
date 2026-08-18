import React, { useState, useEffect } from 'react';
import './AlimentiInScadenza.css';

const AlimentiInScadenza = ({ isLoggedIn, refreshTrigger }) => {
    /*Definizione degli stati*/
    const [alimenti, setAlimenti] = useState([]); /*array vuoto che conterrà gli alimenti prelervati da mongodb */
    
    const caricaAlimenti = () => {
        const token = localStorage.getItem('tokenFridgy');
        if (!token) return;

        fetch('http://localhost:3000/api/alimenti-scadenza', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            if (!response.ok) throw new Error("Errore nella risposta del server");
            return response.json();
        })
        .then(data => setAlimenti(data))
        .catch(error => console.error("Errore nel caricamento dei dati dal server:", error));
    };

    useEffect(() => {
        if (isLoggedIn) {
            caricaAlimenti();
        } else {
            setAlimenti([]);
        }
    }, [isLoggedIn, refreshTrigger]); 

    // Funzione per rimuovere un alimento tramite checkbox
    const handleRimuovi = async (id) => {
        try {
            const token = localStorage.getItem('tokenFridgy');
            const response = await fetch(`http://localhost:3000/api/frigo/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setAlimenti(prev => prev.filter(a => a._id !== id));
            }
        } catch (error) {
            console.error("Errore durante l'eliminazione:", error);
        }
    };

    return (
        <aside id="alimenti-scadenza-widget" className="sidebar-scadenza">
            <h3 className = "titolo-scadenza">Alimenti in Scadenza</h3>

            <div className="lista-scadenza-conteiner">
                {alimenti.length === 0 ? (
                    <p className="nessun-alimento">Nessun alimento in scadenza</p>
                ) : (
                    alimenti.map(alimento => {
                        const grave = alimento.giorniMancanti <= 3;
                        const coloreForte = grave ? "#e53935" : "#fb8c00"; // Rosso acceso se mancano <= 3 giorni, arancione se ne mancano di più
                        
                        // Disegniamo direttamente l'SVG del triangolo così siamo sicuri che compaia sempre (anche senza librerie esterne)
                        const iconaPericolo = grave ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="28" fill={coloreForte} viewBox="0 0 16 16">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="28" fill={coloreForte} viewBox="0 0 16 16">
                                <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                                <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                            </svg>
                        );

                        return (
                            <div key={alimento._id} className = "item-scadenza">
                                {iconaPericolo}

                                <div className = "item-centro">
                                    <span className = "nome-alimento"> {alimento.nome} </span>
                                    <span className = "giorni-rimasti" style={{ color: coloreForte, fontWeight: "bold" }}> {alimento.giorniMancanti} giorni alla scadenza </span>
                                </div>

                                <input 
                                    type="checkbox" 
                                    className="casella-rimozione"
                                    onChange={() => handleRimuovi(alimento._id)} 
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
