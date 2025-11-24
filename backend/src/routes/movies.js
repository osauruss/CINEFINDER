const express = require("express");
const axios = require("axios");

const router = express.Router();

// Films populaires
router.get("/popular", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=1`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des films" });
  }
});



router.get("/credits/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${req.params.id}/credits?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des crédits" });
  }
});

<<<<<<< HEAD
=======
// 🔍 Recherche de films par nom
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query; // ex: /api/movies/search?query=inception
    if (!query) {
      return res.status(400).json({ error: "Paramètre 'query' manquant" });
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query,
          language: "fr-FR",
        },
      }
    );

    res.json({ results: response.data.results });
  } catch (error) {
    console.error("Erreur TMDB /search :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la recherche de films sur TMDB" });
  }
});


>>>>>>> main
// Détails d’un film
router.get("/details/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du film" });
  }
});

module.exports = router;


/*

// backend/src/routes/movies.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

// Route test : récupérer les films populaires de TMDB
router.get("/popular", async (req, res) => {
  try {
    // On utilise la clé API stockée dans .env
    const response = await axios.get("https://api.themoviedb.org/3/movie/popular", {
      params: {
        api_key: process.env.TMDB_API_KEY, // clé TMDB
        language: "fr-FR",                // films en français
        page: 1                            // première page
      }
    });

    // renvoie les données récupérées de TMDB
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la requête TMDB" });
  }
});

module.exports = router;*/
