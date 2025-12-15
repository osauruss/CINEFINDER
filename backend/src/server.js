// backend/src/server.js

/* charger les variables d'environnement depuis le fichier .env */
require('dotenv').config();

/* imports */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

/* middlewares basiques */
app.use(cors());           // autorise les requêtes cross-origin
app.use(express.json());   // parse le JSON dans le body des requêtes

/* Récupérer le Mongo URI depuis process.env */
const MONGO_URI = process.env.MONGO_URI;

/* Fonction pour initialiser la connexion à MongoDB */
async function startServer() {
  try {
    // Connexion à MongoDB Atlas
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB Atlas');

    // Route test racine
    app.get('/', (req, res) => {
      res.send('Backend CineFinder connecté à MongoDB ✅');
    });

    const port = process.env.PORT || 5000;

    // --- IMPORT DES ROUTES ---

    const filmRoutes = require("./routes/filmRoutes");
    app.use("/api/films", filmRoutes);

    const actorRoutes = require("./routes/actors");
    app.use("/api/actors", actorRoutes);

    const watchlistRoutes = require("./routes/watchlist");
    app.use("/api/watchlist", watchlistRoutes);
    
    const movieRoutes = require("./routes/movies");
    app.use("/api/movies", movieRoutes);

    const authRoutes = require("./routes/auth");
    app.use("/api/auth", authRoutes);

    const userRoutes = require("./routes/user"); // (Ancien fichier user.js)
    app.use("/api/users", userRoutes);

    
    const likedFilmsRoutes = require("./routes/likedfilms"); 
    
    // 2. On utilise "/api/liked" pour correspondre au Frontend
    app.use("/api/liked", likedFilmsRoutes);


    // Démarrer le serveur HTTP
    app.listen(port, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
    });

  } catch (err) {
    console.error('❌ Erreur de connexion à MongoDB :', err.message);
    process.exit(1);
  }
}

/* Lance la fonction d'initialisation */
startServer();