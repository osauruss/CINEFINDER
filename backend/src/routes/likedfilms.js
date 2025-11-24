const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");


// ➕ Ajouter un film liké
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { tmdbId, title, poster } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const alreadyAdded = user.likedMovies.some(
      (m) => String(m.tmdbId) === String(tmdbId)
    );

    if (alreadyAdded)
      return res.status(400).json({ message: "Film déjà liké" });

    user.likedMovies.push({ tmdbId, title, poster });
    await user.save();

    res.json({ message: "Film liké 👍" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// ❌ Retirer un film liké
router.delete("/remove/:tmdbId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    user.likedMovies = user.likedMovies.filter(
      (m) => String(m.tmdbId) !== String(req.params.tmdbId)
    );

    await user.save();

    res.json({ message: "Film retiré ❌" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports = router;
