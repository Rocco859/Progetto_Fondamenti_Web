// config.js
// URL base del backend.
// In sviluppo locale usa http://localhost:3000 (il fallback dopo ||).
// In produzione, la piattaforma di hosting (Vercel/Netlify) fornirà
// VITE_API_URL con l'indirizzo reale del backend deployato.
//
// NOTA: Vite espone le variabili d'ambiente tramite "import.meta.env"
// (non "process.env" come in Node), e per motivi di sicurezza rende
// visibili al browser SOLO quelle che iniziano con il prefisso VITE_.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default BASE_URL;
