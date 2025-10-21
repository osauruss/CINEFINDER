// backend/src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
const token = req.headers["authorization"]?.split(" ")[1]; // Récupère le 'Bearer TOKEN'
  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé, token manquant" });
  }

  try {
    // Vérifie le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
       // Ajoute l'ID de l'utilisateur à l'objet 'req' pour les prochaines routes
    req.userId = decoded.id; 
    next(); // Passe au prochain middleware ou à la route
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
};

module.exports = authMiddleware; // N'oublie pas d'exporter !