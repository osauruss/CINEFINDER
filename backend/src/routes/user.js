// backend/src/routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");

//  Route pour récupérer les infos du user connecté
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // 2. On utilise req.userId (comme défini dans le middleware officiel)
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//  Ajouter un acteur aux préférences
router.post("/preferences/actors/:actorId", authMiddleware, async (req, res) => {
  try {
    // 3. Ici aussi, on utilise req.userId
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    if (!user.preferences) user.preferences = { genres: [], actors: [] };
    if (!user.preferences.actors) user.preferences.actors = []; // Sécurité supplémentaire

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

// 🗑️ Supprimer un acteur des favoris
router.delete("/preferences/actors/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Debug (tu pourras les enlever après)
    console.log("🚀 Route DELETE appelée");
    console.log("👉 ID de l'utilisateur (req.userId) :", req.userId);
    
    // 4. On utilise req.userId
    const user = await User.findById(req.userId);
    
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    if (user.preferences && user.preferences.actors) {
      // Filtrage avec conversion String pour sécurité
      user.preferences.actors = user.preferences.actors.filter(
        (actorId) => String(actorId) !== String(id)
      );
      
      await user.save();
    }

    res.json({ message: "Acteur retiré des favoris", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;