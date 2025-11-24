// backend/src/routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware d’authentification (vérifie le token)
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token manquant" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token invalide" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contient l’ID de l’utilisateur
    next();
  } catch (err) {
    res.status(403).json({ message: "Token invalide ou expiré" });
  }
}

// 🔹 Route pour récupérer les infos du user connecté
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 🔹 Ajouter un acteur aux préférences
router.post("/preferences/actors/:actorId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    if (!user.preferences) user.preferences = { genres: [], actors: [] };

    // Évite les doublons
    if (!user.preferences.actors.includes(req.params.actorId)) {
      user.preferences.actors.push(req.params.actorId);
      await user.save();
    }

    res.json({ success: true, actors: user.preferences.actors });
  } catch (err) {
    console.error("Erreur lors de l’ajout d’un acteur :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
