const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  likedMovies: [
    { tmdbId: String, title: String, rating: Number }
  ],
  watchlist: [
    {
      tmdbId: String,     // ID TMDB du film
      title: String,      // Titre du film
      poster: String      // (nouveau champ) URL de l'affiche du film
    }
  ],
  preferences: {
    genres: [String],
    actors: [String]
  }
});

module.exports = mongoose.model("User", userSchema);


