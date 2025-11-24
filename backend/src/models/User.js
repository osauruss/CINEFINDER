const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  likedMovies: [
    { tmdbId: String, title: String, poster: String }
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


