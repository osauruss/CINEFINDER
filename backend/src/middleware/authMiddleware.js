// backend/src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// Middleware to check JWT authentication
const authMiddleware = (req, res, next) => {
  console.log("\n [DEBUG MIDDLEWARE] -----");
  
  // get Authorization header
  const authHeader = req.headers["authorization"];
  console.log(" 1. Received header:", authHeader);

  // extract token from "Bearer token"
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    console.log("No token found!");
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    // verify and decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(" 2. Decoded token (raw):", decoded);

    // find user ID in different possible fields
    const userId = decoded.id || decoded._id || decoded.userId;
    console.log(" 3. Found user ID:", userId);

    // attach user ID to request
    req.userId = userId;
    
    console.log(" [END DEBUG MIDDLEWARE] Going to next route -->\n");
    next();

  } catch (err) {
    console.error(" JWT error:", err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
