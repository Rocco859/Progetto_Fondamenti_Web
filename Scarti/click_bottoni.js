// Selezioniamo gli elementi del Frigo
const btnFrigo = document.getElementById('btn-frigo');
const modaleFrigo = document.getElementById('modale-frigo');
const chiudiFrigo = document.getElementById('chiudi-frigo');

// Selezioniamo gli elementi della Spesa
const btnSpesa = document.getElementById('btn-spesa');
const modaleSpesa = document.getElementById('modale-spesa');
const chiudiSpesa = document.getElementById('chiudi-spesa');

// --- LOGICA FRIGO ---
btnFrigo.addEventListener('click', () => {
  modaleFrigo.classList.add('attivo');
});
chiudiFrigo.addEventListener('click', () => {
  modaleFrigo.classList.remove('attivo');
});

// --- LOGICA SPESA ---
btnSpesa.addEventListener('click', () => {
  modaleSpesa.classList.add('attivo');
});
chiudiSpesa.addEventListener('click', () => {
  modaleSpesa.classList.remove('attivo');
});
