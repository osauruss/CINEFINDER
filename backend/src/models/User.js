const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  likedMovies: [
    {
      tmdbId: { type: String, required: true },
      title: { type: String },
      poster: { type: String },
      rating: { type: Number, default: 0 }, 
      addedAt: { type: Date, default: Date.now }
    }
  ],
  watchlist: [
    {
      tmdbId: String,    
      title: String,    
      poster: String      
    }
  ],
  preferences: {
    genres: [String],
    actors: [String]
  }
});

module.exports = mongoose.model("User", userSchema);


