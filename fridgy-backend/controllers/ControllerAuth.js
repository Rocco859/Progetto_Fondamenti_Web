const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { campiMancanti } = require('../utils/validazione');

// 1. CONTROLLER DELLA REGISTRAZIONE
exports.register = async (req, res) => {
  try {
    const { nome, cognome, codiceFiscale, email, password } = req.body;

    const mancanti = campiMancanti(req.body, ['nome', 'cognome', 'codiceFiscale', 'email', 'password']);
    if (mancanti.length > 0){
      return res.status(400).json({
        success: false,
        message: `Campi obbligatori mancanti: ${mancanti.join(', ')}`
      })
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: "La password deve contenere almeno 8 caratteri." });
    }

    // 1. Criptiamo la password esplicitamente prima di salvare
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Creiamo il nuovo utente con la password criptata
    const nuovoUtente = new User({ nome, cognome, codiceFiscale, email, password: hashedPassword });
    await nuovoUtente.save();

    // Generiamo il token JWT
    const token = jwt.sign(
      { id: nuovoUtente._id, nome: nuovoUtente.nome },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ success: true, message: "🎉 Registrazione completata!", token });
  } catch (error) {
    // AGGIUNTA: gestione specifica dell'errore di chiave duplicata (es. email o
    // codice fiscale già presenti, se hai "unique: true" nello schema User).
    // Senza questo controllo, un utente che si registra due volte riceverebbe
    // un generico 500, che è semanticamente sbagliato: non è un errore del server,
    // è un errore di validazione dei dati inviati dal client (400).
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Email o codice fiscale già registrati." });
    }

    console.error("Errore nella registrazione:", error);
    res.status(500).json({ success: false, message: "Si è verificato un errore interno, riprova più tardi." });
  }
};

// 2. CONTROLLER DEL LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Controlliamo se l'utente esiste nel database
    const utente = await User.findOne({ email });
    if (!utente) {
      return res.status(400).json({ success: false, message: "Email o password errate" });
    }

    // Confrontiamo la password digitata con quella criptata
    const isMatch = await bcrypt.compare(password, utente.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Email o password errate" });
    }

    // Generiamo il Token JWT
    const token = jwt.sign(
      { id: utente._id, nome: utente.nome },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ success: true, message: "👋 Bentornato!", token });
  } catch (error) {
    console.error("Errore nel login:", error);
    res.status(500).json({ success: false, message: "Si è verificato un errore interno, riprova più tardi." });
  }
};