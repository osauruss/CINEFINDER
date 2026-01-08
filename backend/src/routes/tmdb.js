// backend/src/routes/tmdb.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

// Search movies, TV shows and people from TMDB
router.get("/search/multi", async (req, res) => {
  const { query, genres, minRating } = req.query;

  // call TMDB API with search query
  const tmdbRes = await axios.get(
    "https://api.themoviedb.org/3/search/multi",
    {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
        language: "fr-FR",
      },
    }
  );

  // get results from TMDB response
  let results = tmdbRes.data.results;

  // filter results by genres if provided
  if (genres) {
    const genreIds = genres.split(",").map(Number);
    results = results.filter(
      (m) => m.genre_ids?.some((g) => genreIds.includes(g))
    );
  }

  // filter results by minimum rating if provided
  if (minRating) {
    results = results.filter((m) => m.vote_average >= minRating);
  }

  // send filtered results to frontend
  res.json({ results });
});

module.exports = router;
