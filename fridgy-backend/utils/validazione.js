function campiMancanti(dati, campiRichiesti) {
    return campiRichiesti.filter(campo => {
        const valore = dati[campo];
        return valore === undefined || valore === null || valore === "";
    })

}

module.exports = { campiMancanti};