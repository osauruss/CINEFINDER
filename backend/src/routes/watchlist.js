// backend/src/routes/watchlist.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const jwt = require("jsonwebtoken");




// 📌 Ajouter un film à la watchlist
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { tmdbId, title, poster } = req.body;

    console.log("🧠 Requête reçue pour ajouter :", { tmdbId, title, poster });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // Vérifie si le film est déjà dans la liste
    const alreadyAdded = user.watchlist.some((m) => m.tmdbId === tmdbId);
    if (alreadyAdded) return res.status(400).json({ message: "Film déjà dans la watchlist" });

    // Ajoute le film
    user.watchlist.push({ tmdbId, title, poster });
    await user.save();

    res.status(200).json({ message: "Film ajouté à la watchlist ✅" });
  } catch (err) {
    console.error("❌ Erreur dans /add :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports = router;
