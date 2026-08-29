import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css' // Nota: abbiamo puntato ad App.css così non ti serve un altro file CSS vuoto!


//Avvio di react, viene creata una root all'interno della quale reactandrà ad inserire tutta l'interfaccia
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)