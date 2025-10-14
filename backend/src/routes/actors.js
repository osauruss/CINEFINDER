const express = require("express");
const axios = require("axios");
const router = express.Router();

// Détails d’un acteur
router.get("/details/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${req.params.id}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de l'acteur" });
  }
});

// Films associés à un acteur
router.get("/movies/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${req.params.id}/movie_credits?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des films" });
  }
});

module.exports = router;
