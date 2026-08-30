const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { campiMancanti } = require('../utils/validazione');

//Registrazione
exports.register = async (req, res) => {
  try {
    const { nome, cognome, email, password } = req.body; //destrutturazione della richiesta json mandata dal client

    //in caso di campi non compilati da errore
    const mancanti = campiMancanti(req.body, ['nome', 'cognome', 'email', 'password']);
    if (mancanti.length > 0){
      return res.status(400).json({
        success: false,
        message: `Campi obbligatori mancanti: ${mancanti.join(', ')}`
      })
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: "La password deve contenere almeno 8 caratteri." });
    }

    //hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Creazione utente con password criptata e salvataggio nel db
    const nuovoUtente = new User({ nome, cognome, email, password: hashedPassword });
    await nuovoUtente.save();

    //token jwt
    const token = jwt.sign(
      { id: nuovoUtente._id, nome: nuovoUtente.nome },  //payload
      process.env.JWT_SECRET,  //chiave
      { expiresIn: '1d' }    //scadenza
    );

    res.status(201).json({ success: true, message: "Registrazione completata!", token });
  
  //gestione errori
  } catch (error) {

    //errori in caso di duplicati
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Email già registrata." });
    }

    console.error("Errore nella registrazione:", error);
    res.status(500).json({ success: false, message: "Si è verificato un errore interno, riprova più tardi." });
  }
};

//Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

  
    const utente = await User.findOne({ email }); //query al db
    if (!utente) {
      return res.status(400).json({ success: false, message: "Email o password errate" });
    }

    // confronto delle password
    const isMatch = await bcrypt.compare(password, utente.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Email o password errate" });
    }

    //token jwt
    const token = jwt.sign(
      { id: utente._id, nome: utente.nome },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ success: true, message: "Bentornato!", token });
  } catch (error) {
    console.error("Errore nel login:", error);
    res.status(500).json({ success: false, message: "Si è verificato un errore interno, riprova più tardi." });
  }
};