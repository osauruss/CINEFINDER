const express = require("express");
const axios = require("axios");

const router = express.Router();


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


router.get("/:id/providers", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`
    );

    const data = await response.json();


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



router.get("/:id/trailer", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );

    const data = await response.json();

   
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

router.get("/filmreco/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`

    );

    res.json(response.data);
  } catch (error) {
    console.error("Erreur filmreco:", error.message);
    res.status(500).json({ error: "Erreur lors de la récupération des movies reco" });
  }
});



router.get("/search", async (req, res) => {
  try {
    const query = req.query.query; 
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



router.get("/discover", async (req, res) => {
  try {
    const { with_genres } = req.query; 
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&sort_by=popularity.desc&with_genres=${with_genres}`
    );
    res.json(response.data);
  } catch (err) {
    console.error("Erreur discover:", err.message);
    res.status(500).json({ error: "Erreur serveur TMDB" });
  }
});


router.get("/cast", async (req, res) => {
  try {
    const { with_cast } = req.query;
    console.log(" Recherche films avec acteur ID:", with_cast);
    
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&sort_by=popularity.desc&with_cast=${with_cast}`
    );
    
    console.log(" Nombre de films trouvés:", response.data.results.length);
    res.json(response.data);
  } catch (err) {
    console.error("Erreur cast:", err.message);
    res.status(500).json({ error: "Erreur serveur TMDB" });
  }
});

router.get("/filmrecomovies", async (req, res) => {
  try {
    const { with_movie } = req.query;
    
    const response = await axios.get(
     `https://api.themoviedb.org/3/movie/${with_movie}/recommendations?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );
    
    console.log("🎬 Nombre de films trouvés:", response.data.results.length);
    res.json(response.data);
  } catch (err) {
    console.error("Erreur cast:", err.message);
    res.status(500).json({ error: "Erreur serveur TMDB" });
  }
});

router.get("/actor/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(" Recherche acteur ID:", id);
    
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`
    );
    
    console.log(" Acteur trouvé:", response.data.name);
    res.json(response.data);
  } catch (err) {
    console.error("Erreur actor:", err.message);
    res.status(500).json({ error: "Erreur serveur TMDB" });
  }
});

module.exports = router;