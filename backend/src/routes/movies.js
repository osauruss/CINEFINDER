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





// Pour récuperer les providers d’un film
router.get("/:id/providers", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`
    );

    const data = await response.json();

    // On récupère l'entrée FR (ou autre pays si tu veux)
    const info = data.results?.FR;

    if (!info) {
      return res.json({ providers: null });
    }

    res.json({
      link: info.link,
      flatrate: info.flatrate || [],
      rent: info.rent || [],
      buy: info.buy || []
    });

  } catch (err) {
    console.error("Erreur providers:", err);
    res.status(500).json({ error: "Erreur serveur providers" });
  }
});


// Pour récuperer les movie trailer de YouTube
router.get("/:id/trailer", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );

    const data = await response.json();

    // Trouver le trailer officiel
    const trailer = data.results.find(
      (v) =>
        v.type === "Trailer" &&
        v.site === "YouTube"
    );

    if (!trailer) {
      return res.json({ trailer: null });
    }

    res.json({
      trailerKey: trailer.key,
      name: trailer.name
    });

  } catch (err) {
    console.error("Erreur trailer:", err);
    res.status(500).json({ error: "Erreur serveur trailer" });
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

// Recherche de films par nom
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


// 🔍 Découvrir des films par genre (pour les recommandations)
router.get("/discover", async (req, res) => {
  try {
    const { with_genres } = req.query; // On récupère l'ID du genre
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&sort_by=popularity.desc&with_genres=${with_genres}`
    );
    res.json(response.data);
  } catch (err) {
    console.error("Erreur discover:", err.message);
    res.status(500).json({ error: "Erreur serveur TMDB" });
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
