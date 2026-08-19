const httpStatus = require('http-status-codes');

const { verificaTokenEUtente } = require('../utils/verificaToken');

exports.verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization; // recupero token dalla richiesta
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      error: true,
      message: "Utente non autorizzato"
    });
  }

  try {
    const user = await verificaTokenEUtente(token);
    req.userId = user._id; // aggiungo l'utente alla richiesta per poterlo usare nei controller
    next();
  } catch (error) {
    if (error.tipo === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
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

