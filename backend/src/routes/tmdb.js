// backend/src/routes/tmdb.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/search/multi", async (req, res) => {
  const { query, genres, minRating } = req.query;

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

  let results = tmdbRes.data.results;

  if (genres) {
    const genreIds = genres.split(",").map(Number);
    results = results.filter(
      (m) => m.genre_ids?.some((g) => genreIds.includes(g))
    );
  }

  if (minRating) {
    results = results.filter((m) => m.vote_average >= minRating);
  }

  res.json({ results });
});

module.exports = router;
