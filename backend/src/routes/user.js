// backend/src/routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");

// Route to get connected (logged-in) user information
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // get user ID from auth middleware
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    // server error
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/user/preferences/genres
// Update user favorite genres
router.post("/preferences/genres", authMiddleware, async (req, res) => {
  try {
    // authMiddleware sets req.userId
    const userId = req.userId;
    const { genres } = req.body; // TMDB genre IDs

    // check if genres is an array
    if (!Array.isArray(genres)) {
      return res
        .status(400)
        .json({ error: "The 'genres' field must be an array of IDs" });
    }

    // update user preferences
    const user = await User.findByIdAndUpdate(
      userId,
      { "preferences.genres": genres },
      { new: true }
    );

    res.json({
      message: "Genres updated",
      genres: user.preferences.genres,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add an actor to user preferences
router.post("/preferences/actors/:actorId", authMiddleware, async (req, res) => {
  try {
    // get user with ID from auth middleware
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // initialize preferences if not exists
    if (!user.preferences) user.preferences = { genres: [], actors: [] };
    if (!user.preferences.actors) user.preferences.actors = [];

    // avoid duplicates
    if (!user.preferences.actors.includes(req.params.actorId)) {
      user.preferences.actors.push(req.params.actorId);
      await user.save();
    }

    res.json({ success: true, actors: user.preferences.actors });
  } catch (err) {
    console.error("Error while adding actor:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove an actor from favorites
router.delete("/preferences/actors/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // debug logs (can be removed later)
    console.log("DELETE route called");
    console.log("User ID (req.userId):", req.userId);

    // get user using ID from auth middleware
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.preferences && user.preferences.actors) {
      // filter actor list and remove the selected actor
      // convert to String to be safe
      user.preferences.actors = user.preferences.actors.filter(
        (actorId) => String(actorId) !== String(id)
      );

      await user.save();
    }

    res.json({ message: "Actor removed from favorites", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
