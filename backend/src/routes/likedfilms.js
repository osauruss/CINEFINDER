const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware"); // check that user is authenticated

// Add a movie to liked list or rate a movie
router.post("/add", authMiddleware, async (req, res) => {
  try {
    // get movie data and rating from request body
    const { tmdbId, title, poster, rating } = req.body;

    // find user with ID from auth middleware
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // check if movie already exists in liked movies
    const existingIndex = user.likedMovies.findIndex(
      (m) => String(m.tmdbId) === String(tmdbId)
    );

    if (existingIndex !== -1) {
      // CASE 1: movie already exists -> update rating
      user.likedMovies[existingIndex].rating = rating;

      // update title and poster if changed
      user.likedMovies[existingIndex].title = title;
      user.likedMovies[existingIndex].poster = poster;
      
      await user.save();
      return res.json({
        message: "Rating updated",
        likedMovies: user.likedMovies
      });
    } else {
      // CASE 2: movie does not exist -> add movie with rating
      user.likedMovies.push({ 
        tmdbId, 
        title, 
        poster, 
        rating, // save movie rating
        addedAt: new Date() 
      });
      
      await user.save();
      return res.json({
        message: "Movie rated and added",
        likedMovies: user.likedMovies
      });
    }

  } catch (err) {
    // server error
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove a liked movie and its rating
router.delete("/remove/:tmdbId", authMiddleware, async (req, res) => {
  try {
    // find user by ID
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // keep all movies except the selected one
    user.likedMovies = user.likedMovies.filter(
      (m) => String(m.tmdbId) !== String(req.params.tmdbId)
    );

    await user.save();

    res.json({
      message: "Movie and rating removed",
      likedMovies: user.likedMovies
    });
  } catch (err) {
    // server error
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
