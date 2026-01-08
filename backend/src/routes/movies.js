const express = require("express");
const axios = require("axios");

const router = express.Router();

// Get popular movies from TMDB
router.get("/popular", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=1`
    );
    res.json(response.data);
  } catch (error) {
    // error while fetching popular movies
    res.status(500).json({ error: "Error while fetching movies" });
  }
});

// Get streaming providers for a movie
router.get("/:id/providers", async (req, res) => {
  try {
    const { id } = req.params;

    // fetch providers information from TMDB
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`
    );

    const data = await response.json();

    // get French providers only
    const info = data.results?.FR;

    if (!info) {
      return res.json({ providers: null });
    }

    // send providers details
    res.json({
      link: info.link,
      flatrate: info.flatrate || [],
      rent: info.rent || [],
      buy: info.buy || []
    });

  } catch (err) {
    console.error("Providers error:", err);
    res.status(500).json({ error: "Providers server error" });
  }
});

// Get movie trailer
router.get("/:id/trailer", async (req, res) => {
  try {
    const { id } = req.params;

    // fetch movie videos from TMDB
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );

    const data = await response.json();

    // find YouTube trailer
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
    console.error("Trailer error:", err);
    res.status(500).json({ error: "Trailer server error" });
  }
});

// Get movie credits (cast & crew)
router.get("/credits/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${req.params.id}/credits?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error while fetching credits" });
  }
});

// Get movie details for recommendation
router.get("/filmreco/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );

    res.json(response.data);
  } catch (error) {
    console.error("Film reco error:", error.message);
    res.status(500).json({ error: "Error while fetching recommended movie" });
  }
});

// Search movies by title
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query;

    // check if query exists
    if (!query) {
      return res.status(400).json({ error: "Missing 'query' parameter" });
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
    console.error("TMDB search error:", error);
    res.status(500).json({ error: "Error while searching movies" });
  }
});

// Get movie details by ID
router.get("/details/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error while fetching movie details" });
  }
});

// Discover movies by genre
router.get("/discover", async (req, res) => {
  try {
    const { with_genres } = req.query;

    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&sort_by=popularity.desc&with_genres=${with_genres}`
    );
    res.json(response.data);
  } catch (err) {
    console.error("Discover error:", err.message);
    res.status(500).json({ error: "TMDB server error" });
  }
});

// Discover movies by actor
router.get("/cast", async (req, res) => {
  try {
    const { with_cast } = req.query;
    console.log("Searching movies with actor ID:", with_cast);
    
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&sort_by=popularity.desc&with_cast=${with_cast}`
    );
    
    console.log("Number of movies found:", response.data.results.length);
    res.json(response.data);
  } catch (err) {
    console.error("Cast error:", err.message);
    res.status(500).json({ error: "TMDB server error" });
  }
});

// Get recommended movies based on a movie
router.get("/filmrecomovies", async (req, res) => {
  try {
    const { with_movie } = req.query;
    
    const response = await axios.get(
     `https://api.themoviedb.org/3/movie/${with_movie}/recommendations?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );
    
    console.log("Movies found:", response.data.results.length);
    res.json(response.data);
  } catch (err) {
    console.error("Recommendation error:", err.message);
    res.status(500).json({ error: "TMDB server error" });
  }
});

// Get actor details by ID
router.get("/actor/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Searching actor ID:", id);
    
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );
    
    console.log("Actor found:", response.data.name);
    res.json(response.data);
  } catch (err) {
    console.error("Actor error:", err.message);
    res.status(500).json({ error: "TMDB server error" });
  }
});

module.exports = router;
