const httpStatus = require('http-status-codes');

const { verificaTokenEUtente } = require('../utils/verificaToken');

exports.verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization; // recupero token dalla richiesta
  const token = authHeader && authHeader.startsWith('Bearer ') //verifica che l'header esista e che inizi con barrer
    ? authHeader.split(' ')[1]                                 //se cosi fosse spezza l'header e recupera il token puro
    : null;                                                    //altrimenti null

  if (!token) {                                        //se il token non c'è richiesta bloccata
    return res.status(httpStatus.UNAUTHORIZED).json({
      error: true,
      message: "Utente non autorizzato"
    });
  }

  try {    //verifica della validità del token
    const user = await verificaTokenEUtente(token);
    req.userId = user._id; // aggiungo l'utente alla richiesta per poterlo usare nei controller
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(httpStatus.FORBIDDEN).json({
        error: true,
        message: "Token non valido o scaduto."
      });
    }

    if (error.tipo === 'UTENTE_NON_TROVATO') {
      return res.status(httpStatus.FORBIDDEN).json({
        error: true,
        message: "Utente non trovato."
      });
    }
  }
};

