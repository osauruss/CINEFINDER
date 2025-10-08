// backend/src/server.js
// ================
// Exemple de connexion à MongoDB Atlas avec mongoose
// Bien commenté pour que tu comprennes chaque étape.
// ================

/* charger les variables d'environnement depuis le fichier .env */
require('dotenv').config();

/* imports */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

/* middlewares basiques */
app.use(cors());           // autorise les requêtes cross-origin (utile pour React local)
app.use(express.json());   // parse le JSON dans le body des requêtes

/* Récupérer le Mongo URI depuis process.env (fichier .env) */
const MONGO_URI = process.env.MONGO_URI;

/* Fonction pour initialiser la connexion à MongoDB */
async function startServer() {
  try {
    // Connexion à MongoDB Atlas
    // mongoose.connect retourne une promesse. On l'attend avant de démarrer le serveur.
    await mongoose.connect(MONGO_URI /*, { useNewUrlParser: true, useUnifiedTopology: true } */);

    console.log('✅ Connecté à MongoDB Atlas');

    // Exemple d'une route test
    app.get('/', (req, res) => {
      res.send('Backend CineFinder connecté à MongoDB ✅');
    });

    // Démarrer le serveur HTTP
    const port = process.env.PORT || 5000;
    // Import des routes
    const filmRoutes = require("./routes/filmRoutes");

    // Utilisation des routes (elles seront accessibles sous /api/films)
    app.use("/api/films", filmRoutes);

    const movieRoutes = require("./routes/movies");
    app.use("/api/movies", movieRoutes);


    app.listen(port, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
    });

  } catch (err) {
    console.error('❌ Erreur de connexion à MongoDB :', err.message);
    // Si la connexion échoue, arrêter l'application (ou gérer la tentative de reconnexion)
    process.exit(1);
  }
}

/* Lance la fonction d'initialisation */
startServer();

