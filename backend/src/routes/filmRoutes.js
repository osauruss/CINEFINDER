// Import des modules nécessaires
const express = require("express");
const router = express.Router();


router.get("/test", (req, res) => {
  res.json({ message: "L'API Films fonctionne !" });
});

// On exporte le router pour l'utiliser ailleurs
module.exports = router;
