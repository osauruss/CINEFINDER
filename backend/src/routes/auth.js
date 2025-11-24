// backend/src/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ton schéma User enrichi

const router = express.Router();

/**
 * 📌 ROUTE : Inscription utilisateur
 * @route POST /api/auth/register
 * @body { username, email, password }
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'email est déjà utilisé
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email déjà utilisé" });

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création utilisateur avec champs par défaut
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      likedMovies: [], // liste vide au départ
      preferences: { genres: [], actors: [] }
    });

    await newUser.save();

    res.status(201).json({ message: "✅ Utilisateur créé avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription" });
  }
});

/**
 * 📌 ROUTE : Connexion utilisateur
 * @route POST /api/auth/login
 * @body { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Utilisateur introuvable" });

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Mot de passe incorrect" });

    // Générer un JWT contenant l'ID utilisateur
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token valable 1 jour
    );

    res.json({
      message: "Connexion réussie ✅",
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la connexion" });
  }
});

/**
 * 📌 ROUTE : Profil utilisateur (protégée par JWT)
 * @route GET /api/auth/profile
 * @header Authorization: Bearer <token>
 */
router.get("/profile", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // format: "Bearer token"

  if (!token) return res.status(401).json({ error: "Token manquant" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur dans MongoDB sans renvoyer le password
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.json({ message: "✅ Accès autorisé", user });
  } catch (err) {
    res.status(401).json({ error: "Token invalide" });
  }
});



module.exports = router;
