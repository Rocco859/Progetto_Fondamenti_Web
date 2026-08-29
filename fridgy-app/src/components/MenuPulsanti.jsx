import React, { useState, useEffect } from 'react';
import './MenuPulsanti.css';
import BASE_URL from '../config';
import { useAppContext } from '../context/AppContext';



function MenuPulsanti() {
    const { isLoggedIn, setActivePopup, refreshTrigger } = useAppContext();  //recupero dal context
    const [isFrigoOpen, setIsFrigoOpen] = useState(false);
    const [isSpesaOpen, setIsSpesaOpen] = useState(false);

    //stati per la spesa
    const [listaSpesa, setListaSpesa] = useState([]);
    const [loadingSpesa, setLoadingSpesa] = useState(false);
    const [nuovoAlimento, setNuovoAlimento] = useState('');

    //stati per il frigo
    const [alimentiFrigo, setAlimentiFrigo] = useState([]);
    const [loadingFrigo, setLoadingFrigo] = useState(false);
    const [ricercaFrigo, setRicercaFrigo] = useState('');

    const handleAggiungiSpesa = async () => {
        if (nuovoAlimento.trim() !== '') {
            try {
                const token = localStorage.getItem('tokenFridgy');
                const response = await fetch(`${BASE_URL}/api/v1/spesa/aggiungi`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ nomeAlimento: nuovoAlimento.trim() })
                });
                const data = await response.json();
                if (response.ok) {
                    setListaSpesa([...listaSpesa, data.elemento]);
                    setNuovoAlimento('');
                }
            } catch (error) {
                console.error("Errore durante l'aggiunta alla lista spesa:", error);
            }
        }
    };

    //controllo per il frigo
    const handleClickFrigo = () => {
        if (isLoggedIn) {
            setIsFrigoOpen(true); // Se è loggato, apre il suo frigo
        } else {
            setActivePopup('login'); // Se è ospite, apre il popup di accesso
        }
    };

    //controllo per la spesa (funziona come il frigo)
    const handleClickSpesa = () => {
        if (isLoggedIn) {
            setIsSpesaOpen(true);
        } else {
            setActivePopup('login');
        }
    };

    // Funzione per eliminare un alimento dal database
    const handleRimuoviAlimento = async (id) => {
        if (!id) return;
        try {
            const token = localStorage.getItem('tokenFridgy');
            const response = await fetch(`${BASE_URL}/api/v1/frigo/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                //se l'eliminazione è confermata viene eliminato anche nell array
                setAlimentiFrigo(prev => prev.filter(alimento => alimento._id !== id));
            } else {
                console.error("Errore durante l'eliminazione");
            }
        } catch (error) {
            console.error("Errore di rete:", error);
        }
    };

    //funzione quando apriamo il tasto firgo
    useEffect(() => {
        if (isFrigoOpen) {
            setRicercaFrigo(''); // Resetta la barra di ricerca all'apertura
            const fetchFrigo = async () => {
                setLoadingFrigo(true);
                try {
                    const token = localStorage.getItem('tokenFridgy');
                    const response = await fetch(`${BASE_URL}/api/v1/frigo`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();

                    if (response.ok) {
                        //se il backend da conferma salviamo i dati che ci passa
                        setAlimentiFrigo(data.alimenti || data || []);
                    } else {
                        console.error("Errore nel caricamento del frigo:", data.message);
                    }
                } catch (error) {
                    console.error("Errore di rete:", error);
                } finally {
                    setLoadingFrigo(false);
                }
            };
            fetchFrigo();
        }
    }, [isFrigoOpen, refreshTrigger]); // Si attiva ogni volta che apri il frigo o quando aggiungi un nuovo alimento

    //funzione quando aprimao la spesa (uguale al frigo)
    useEffect(() => {
        if (isSpesaOpen) {
            const fetchSpesa = async () => {
                setLoadingSpesa(true);
                try {
                    const token = localStorage.getItem('tokenFridgy');
                    const response = await fetch(`${BASE_URL}/api/v1/spesa`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();

                    if (response.ok) {
                        setListaSpesa(data.lista || []);
                    }
                } catch (error) {
                    console.error("Errore di rete:", error);
                } finally {
                    setLoadingSpesa(false);
                }
            };
            fetchSpesa();
        }
    }, [isSpesaOpen, refreshTrigger]);


    //uguale a frigo
    const handleRimuoviDaSpesa = async (id) => {
        try {
            const token = localStorage.getItem('tokenFridgy');
            const response = await fetch(`${BASE_URL}/api/v1/spesa/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setListaSpesa(prev => prev.filter(item => item._id !== id));
            }
        } catch (error) {
            console.error("Errore durante la rimozione dalla lista spesa:", error);
        }
    };

    //funzione per la ricerca
    const alimentiFiltrati = alimentiFrigo.filter(alimento =>
        (alimento.nomeAlimento || alimento.nome || '').toLowerCase().includes(ricercaFrigo.toLowerCase())
    );

    return (
        <div className="pulsanti-container">

            <div className="bottoni-container">
            
                <button className="btn-card" onClick={handleClickFrigo}>
                    IL TUO<br />FRIGO
                </button>
                <button className="btn-card" onClick={handleClickSpesa}>
                    LISTA<br />SPESA
                </button>
            </div>
            {/*Frigo*/}
            {isFrigoOpen && (
                 <div className="modale-overlay attivo" role="dialog" aria-modal="true" aria-labelledby="titolo-frigo" onClick={() => setIsFrigoOpen(false)}>
                    <div className="modale-contenuto" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-chiudi-dash" onClick={() => setIsFrigoOpen(false)}>✕</button>

                        <h2 id="titolo-frigo">CONTENUTO FRIGO</h2>

                        {/*barra di ricerca*/}
                        <input
                            type="text"
                            placeholder="Cerca alimento nel frigo..."
                            value={ricercaFrigo}
                            onChange={(e) => setRicercaFrigo(e.target.value)}
                            className = "input-ricerca"
                        />

                        <ul className="lista-elementi lista-scrollabile">
                            {loadingFrigo ? (
                                <li>Caricamento in corso...</li>
                            ) : alimentiFrigo.length === 0 ? (
                                <li>Il tuo frigo è vuoto!</li>
                            ) : alimentiFiltrati.length === 0 ? (
                                <li>Nessun alimento trovato.</li>
                            ) : (
                                alimentiFiltrati.map((alimento, index) => (
                                    <li key={alimento._id || index}>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleRimuoviAlimento(alimento._id)}
                                            className="checkbox-rimozione"
                                        />
                                        <span>
                                            {alimento.nomeAlimento || alimento.nome}
                                            {alimento.dataScadenza || alimento.scadenzaAlimento ? ` (Scad: ${new Date(alimento.dataScadenza || alimento.scadenzaAlimento).toLocaleDateString()})` : ''}
                                            {alimento.quantita || alimento.quantitaAlimento ? ` - Qtà: ${alimento.quantita || alimento.quantitaAlimento}` : ''}
                                        </span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            )}

            {/*spesa*/}
            {isSpesaOpen && (
                    <div className="modale-overlay attivo" role="dialog" aria-modal="true" aria-labelledby="titolo-spesa" onClick={() => setIsSpesaOpen(false)}>
                    <div className="modale-contenuto" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-chiudi-dash" onClick={() => setIsSpesaOpen(false)}>✕</button>

                        <h2 id="titolo-spesa">LISTA DELLA SPESA</h2>

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
                            {loadingSpesa ? (
                                <li>Caricamento in corso...</li>
                            ) : listaSpesa.length === 0 ? (
                                <li>La tua lista della spesa è vuota!</li>
                            ) : (
                                listaSpesa.map((item) => (
                                    <li key={item._id}>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleRimuoviDaSpesa(item._id)}
                                            className = "checkbox-rimozione"
                                        />
                                        <span>{item.nome}</span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            )}

        </div>
    );
}

export default MenuPulsanti;