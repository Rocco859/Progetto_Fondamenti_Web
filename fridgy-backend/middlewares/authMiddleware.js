const jwt = require('jsonwebtoken');
const User = require('../models/User');
const httpStatus = require('http-status-codes');

exports.verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization; // recupero token dalla richiesta
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (token) {
    // AGGIUNTA rispetto alla slide: jwt.verify lancia un'eccezione se il token
    // non è valido/scaduto (non ritorna un valore falsy), quindi va avvolto
    // in un try/catch, altrimenti il server crasha o Express risponde con
    // un 500 generico invece di un errore di autenticazione gestito.
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // MODIFICATO: "decoded.data" -> "decoded.id"
      // Nel tuo ControllerAuth.js firmi il token con
      // jwt.sign({ id: utente._id, nome: utente.nome }, ...)
      // quindi la chiave da leggere qui deve essere "id", non "data"
      // (la slide usa "data" perché nel suo esempio il token viene firmato
      // con jwt.sign({ data: user._id, ... }, ...) — una convenzione diversa)
      User.findById(decoded.id).then(user => {
        if (user) {
          req.userId = user._id;
          next();
        } else {
          res.status(httpStatus.FORBIDDEN).json({
            error: true,
            message: "No User account found."
          });
        }
      });
    } catch (error) {
      res.status(httpStatus.FORBIDDEN).json({
        error: true,
        message: "Token non valido o scaduto."
      });
    }
  } else {
    res.status(httpStatus.UNAUTHORIZED).json({
      error: true,
      message: "Utente non autorizzato."
    });
  }
};