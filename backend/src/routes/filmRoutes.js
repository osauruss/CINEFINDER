// Import required modules
const express = require("express");
const router = express.Router();

// Test route to check if the films API is working
router.get("/test", (req, res) => {
  res.json({ message: "Films API is working!" });
});

// Export the router to use it in other files
module.exports = router;
