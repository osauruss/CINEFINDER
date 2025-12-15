const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware"); // Vérifie que le chemin est bon

// ⭐ AJOUTER OU NOTER un film (Rating 1-5)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    // On récupère aussi la note (rating)
    const { tmdbId, title, poster, rating } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // On cherche si le film est déjà dans la liste
    const existingIndex = user.likedMovies.findIndex(
      (m) => String(m.tmdbId) === String(tmdbId)
    );

    if (existingIndex !== -1) {
      // 🔄 CAS 1 : Le film existe déjà -> On MET À JOUR la note
      user.likedMovies[existingIndex].rating = rating;
      // Optionnel : on met à jour le titre/poster si ça a changé
      user.likedMovies[existingIndex].title = title;
      user.likedMovies[existingIndex].poster = poster;
      
      await user.save();
      return res.json({ message: "Note mise à jour ⭐", likedMovies: user.likedMovies });
    } else {
      // ➕ CAS 2 : Le film n'existe pas -> On l'AJOUTE avec la note
      user.likedMovies.push({ 
        tmdbId, 
        title, 
        poster, 
        rating, // On enregistre la note
        addedAt: new Date() 
      });
      
      await user.save();
      return res.json({ message: "Film noté et ajouté 👍", likedMovies: user.likedMovies });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ❌ RETIRER un film liké (et sa note)
router.delete("/remove/:tmdbId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // On filtre pour tout garder SAUF le film ciblé
    user.likedMovies = user.likedMovies.filter(
      (m) => String(m.tmdbId) !== String(req.params.tmdbId)
    );

    await user.save();

    res.json({ message: "Film et note retirés ❌", likedMovies: user.likedMovies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;