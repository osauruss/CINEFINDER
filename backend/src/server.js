// backend/src/server.js

/* load environment variables from .env file */
require('dotenv').config();

/* imports */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

/* basic middlewares  */
app.use(cors());           // allow cross-origin requests
app.use(express.json());   // parse JSON from request body

/* get MongoDB URI from environment variables */
const MONGO_URI = process.env.MONGO_URI;

/* function to start the server and connect to MongoDB */
async function startServer() {
  try {
    // connect to MongoDB Atlas
    await mongoose.connect(MONGO_URI);
    console.log('Connecté à MongoDB Atlas');

     // test root route
    app.get('/', (req, res) => {
      res.send('Backend CineFinder connecté à MongoDB');
    });

    const port = process.env.PORT || 5000;

    // ROUTES IMPORTS

    const filmRoutes = require("./routes/filmRoutes");
    app.use("/api/films", filmRoutes);

    const actorRoutes = require("./routes/actors");
    app.use("/api/actors", actorRoutes);

    const watchlistRoutes = require("./routes/watchlist");
    app.use("/api/watchlist", watchlistRoutes);
    
    const movieRoutes = require("./routes/movies");
    app.use("/api/movies", movieRoutes);

    const tmdbRoutes = require("./routes/tmdb");
    app.use("/api/tmdb", tmdbRoutes);


    const authRoutes = require("./routes/auth");
    app.use("/api/auth", authRoutes);

    const userRoutes = require("./routes/user"); 
    app.use("/api/users", userRoutes);

    
    const likedFilmsRoutes = require("./routes/likedfilms"); 
    app.use("/api/liked", likedFilmsRoutes);


    // start HTTP server
    app.listen(port, () => {
      console.log(`Serveur démarré sur http://localhost:${port}`);
    });

  } catch (err) {
    console.error('Erreur de connexion à MongoDB :', err.message);
    process.exit(1);
  }
}

/* call the start function */
startServer();