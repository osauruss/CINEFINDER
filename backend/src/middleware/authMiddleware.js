// backend/src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("\n [DEBUG MIDDLEWARE] -----");
  
  const authHeader = req.headers["authorization"];
  console.log(" 1. Header reçu :", authHeader);

  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    console.log("Pas de token !");
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("2. Token décodé (Brut) :", decoded);

    // On cherche l'ID partout où il pourrait se cacher
    const userId = decoded.id || decoded._id || decoded.userId;
    console.log(" 3. ID trouvé :", userId);

    req.userId = userId;
    
    console.log(" [FIN DEBUG MIDDLEWARE] Passage à la route suivante -->\n");
    next();

  } catch (err) {
    console.error(" Erreur JWT :", err.message);
    return res.status(403).json({ message: "Token invalide" });
  }
};

module.exports = authMiddleware;