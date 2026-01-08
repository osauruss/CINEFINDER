// backend/src/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 

const router = express.Router();

/**
 * ROUTE: User registration
 * @route POST /api/auth/register
 * @body { username, email, password }
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if email is already used
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already used" });

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user with default values
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      likedMovies: [], // empty list at start
      preferences: { genres: [], actors: [] }
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during registration" });
  }
});

/**
 * ROUTE: User login
 * @route POST /api/auth/login
 * @body { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "User not found" });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Wrong password" });

    // create JWT with user ID
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // token valid for 1 day
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
});

/**
 * ROUTE: User profile (protected with JWT)
 * @route GET /api/auth/profile
 * @header Authorization: Bearer <token>
 */
router.get("/profile", async (req, res) => {
  // get token from Authorization header
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "Missing token" });

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user from database without password
    const user = await User.findById(decoded.id).select("-password");

    if (!user)
      return res.status(404).json({ error: "User not found" });

    res.json({ message: "Access allowed", user });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;
