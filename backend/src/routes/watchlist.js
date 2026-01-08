// backend/src/routes/watchlist.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const jwt = require("jsonwebtoken");

// Add a movie to the watchlist
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { tmdbId, title, poster } = req.body;

    // log received request data
    console.log("Request received to add:", { tmdbId, title, poster });

    // find user by ID from auth middleware
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // check if movie is already in watchlist
    const alreadyAdded = user.watchlist.some(
      (m) => String(m.tmdbId) === String(tmdbId)
    );
    if (alreadyAdded)
      return res.status(400).json({ message: "Movie already in watchlist" });

    // add movie to watchlist
    user.watchlist.push({ tmdbId, title, poster });
    await user.save();

    res.status(200).json({ message: "Movie added to watchlist" });
  } catch (err) {
    // error while adding movie
    console.error("Error in /add:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove a movie from the watchlist
router.delete("/remove/:tmdbId", authMiddleware, async (req, res) => {
  try {
    const { tmdbId } = req.params;

    // find user by ID
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // remove the movie with the matching tmdbId
    // convert to String to be sure comparison works
    user.watchlist = user.watchlist.filter(
      (movie) => String(movie.tmdbId) !== String(tmdbId)
    );

    await user.save();

    res.status(200).json({ message: "Movie removed from watchlist" });
  } catch (err) {
    // error while removing movie
    console.error("Error in /remove:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
