const express = require("express");
const axios = require("axios");
const router = express.Router();

// Get actor details
router.get("/details/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${req.params.id}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );
    res.json(response.data);
  } catch (error) {
    // error while fetching actor details
    res.status(500).json({ error: "Error while fetching actor details" });
  }
});

// Get movies related to an actor
router.get("/movies/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${req.params.id}/movie_credits?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );
    res.json(response.data);
  } catch (error) {
    // error while fetching actor movies
    res.status(500).json({ error: "Error while fetching actor movies" });
  }
});

module.exports = router;
