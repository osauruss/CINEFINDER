
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";



const Profile = ({ token, user }) => {
  //State for storing the complete objects of the actors (name, image, id...)
  const [favActors, setFavActors] = useState([]);

  const [selectedGenres, setSelectedGenres] = useState([]);


    // To manage the selected genres
  useEffect(() => {
// Normalize stored preferences to TMDB genre IDs. 
// The backend may store either TMDB IDs (numbers/strings) or genre names.
    if (user?.preferences?.genres && Array.isArray(user.preferences.genres)) {
      const ids = user.preferences.genres
        .map((g) => {
          // already a number
          if (typeof g === "number") return g;
          // numeric string
          const n = Number(g);
          if (!Number.isNaN(n)) return n;
          // try to match by name (case-insensitive)
          const found = TMDB_GENRES.find((tg) => tg.name.toLowerCase() === String(g).toLowerCase());
          return found ? found.id : null;
        })
        .filter((v) => v !== null && v !== undefined);

      setSelectedGenres(ids);
    } else {
      setSelectedGenres([]);
    }
  }, [user]);



 // List of all available genres
  const TMDB_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Aventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comédie" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentaire" },
  { id: 18, name: "Drame" },
  { id: 10751, name: "Famille" },
  { id: 14, name: "Fantastique" },
  { id: 36, name: "Historique" },
  { id: 27, name: "Horreur" },
  { id: 10402, name: "Musique" },
  { id: 9648, name: "Mystère" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science-Fiction" },
  { id: 10770, name: "Téléfilm" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "Guerre" },
  { id: 37, name: "Western" },
];


  const toggleGenre = async (id) => {
  let updatedGenres;
  
  if (selectedGenres.includes(id)) {
    updatedGenres = selectedGenres.filter(g => g !== id);
  } else {
    updatedGenres = [...selectedGenres, id];
  }

  setSelectedGenres(updatedGenres);

  try {
    await axios.post(
      "http://localhost:5000/api/user/preferences/genres",
      { genres: updatedGenres },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // No need for an alert here, otherwise it pops up with every click
    console.log("Genres sauvegardés :", updatedGenres);
  } catch (err) {
    console.error("Erreur lors de la sauvegarde automatique des genres :", err);
  }
};




  const saveGenres = async () => {
  try {
    await axios.post(
      "http://localhost:5000/api/users/preferences/genres",
      { genres: selectedGenres }, // Here are the TMDB IDs
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Genres sauvegardés !");
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la sauvegarde des genres.");
  }
};


  //useEffect to retrieve details of favorite actors
  useEffect(() => {
    const fetchFavActors = async () => {
      //We check if the user has any preferences and registered actors (IDs).
      if (user && user.preferences && user.preferences.actors && user.preferences.actors.length > 0) {
        try {
          // We create a list of requests for each actor ID
          // We use the same route as in ActorDetails: /api/actors/details/:id
          const promises = user.preferences.actors.map((id) =>
            axios.get(`http://localhost:5000/api/actors/details/${id}`)
          );

          // We are waiting for all requests to be completed.
          const responses = await Promise.all(promises);

          // We extract the data (.data) from each response
          setFavActors(responses.map((res) => res.data));
        } catch (err) {
          console.error("Erreur lors du chargement des acteurs favoris :", err);
        }
      }
    };

    fetchFavActors();
  }, [user]); // Se relance si l'objet user change

  if (!token) return <p>Vous devez être connecté pour voir votre profil.</p>;
  if (!user) return <p>Chargement du profil...</p>;

  //Sorting of liked films
const sortedLikedMovies = [...(user.likedMovies || [])].sort((a, b) => b.rating - a.rating);

  // Composant note circulaire
  const CircularRating = ({ value }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 10) * circumference;

    return (
      <div style={{ position: "relative", width: "60px", height: "60px",color:"white" }}>
        <svg width="60" height="60">
          <circle cx="30" cy="30" r={radius} stroke="#e0e0e0" strokeWidth="5" fill="transparent" />
          <circle
            cx="30" cy="30" r={radius} stroke="url(#grad)" strokeWidth="5" fill="transparent"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          />
          <defs>
            <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>
          </defs>
        </svg>
        <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "14px", fontWeight: "600" }}>
          {value ? value.toFixed(1) : "0.0"}
        </span>
      </div>
    );
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto", fontFamily: "Inter, sans-serif",color:"white" }}>
      <h2 style={{ textAlign: "center" }}>👤 Profil de {user.username}</h2>
      <p><strong>Email :</strong> {user.email}</p>
      
      {/*  Preferences */}
      <div style={{ marginTop: "20px", background: "#2a2a2a", padding: "15px", borderRadius: "10px",color:"white" }}>
        <h3> Préférences</h3>
        {/*  Favorite genres can be changed */}
        <div style={{ marginTop: "30px", background: "#2a2a2a", padding: "20px", borderRadius: "14px" }}>
          <h3> Genres préférés</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
            {TMDB_GENRES.map((genre) => (
              <div
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "20px",
                  backgroundColor: selectedGenres.includes(genre.id) ? "#f5b50a" : "#444",
                  color: selectedGenres.includes(genre.id) ? "#000" : "#fff",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "0.2s",
                  userSelect: "none"
                }}
              >
                {genre.name}
              </div>
            ))}
          </div>
          <button
            onClick={saveGenres}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#4caf50",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            💾 Sauvegarder
          </button>
        </div>

      

        {/* Favorite Actors section */}
        <h4 style={{ marginTop: "20px", marginBottom: "15px",color:"white" }}>Acteurs favoris</h4>
        
        {favActors.length > 0 ? (
          <div  className="scroll-bar-custom"
            style={{
              display: "flex",
              overflowX: "auto", // Allows horizontal scrolling, just like in movies.
              gap: "20px",
              padding: "15px 0",
            }}
          >
            {favActors.map((actor) => (
              <Link
                key={actor.id}
                to={`/actor/${actor.id}`} //Redirecting to the actor's page
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  minWidth: "140px",
                  textAlign: "center",
                  backgroundColor: "#1a1a1a",
                  
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  padding: "10px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  display: "block" // Important for the Link to take the form of the block
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                }}
              >
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : "https://via.placeholder.com/120x180?text=No+Image"
                  }
                  alt={actor.name}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    marginBottom: "8px",
                    height: "180px", // A specific height is set for uniformity.
                    objectFit: "cover"
                  }}
                />
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "white",
                    marginBottom: "2px",
                  }}
                >
                  {actor.name}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: "#666", fontStyle: "italic" }}>Aucun acteur favori pour le moment.</p>
        )}
      </div>

      {/*  Favorite films */}
      <div style={{ marginTop: "50px" }}>
        <h2
          style={{
            fontSize: "1.8rem",
            borderBottom: "3px solid #f5b50a",
            display: "inline-block",
            paddingBottom: "5px",
            marginBottom: "20px",
          }}
        >
          Films vus et notés
        </h2>
        
        <div style={{ background: "#2a2a2a", padding: "20px", borderRadius: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
          {sortedLikedMovies.length > 0 ? (
            <div  className="scroll-bar-custom"
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "22px",
                padding: "15px 0",
              }}
            >
            {sortedLikedMovies.map((movie) => (
              <Link
                key={movie.tmdbId}
                to={`/movie/${movie.tmdbId}`}
                style={{
                  minWidth: "200px",
                  maxWidth: "200px",
                  background: "#181818",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
                  padding: "12px",
                  textAlign: "center",
                  color: "inherit",
                  textDecoration: "none",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.10)";
                }}
              >
                {/* Poster */}
                <img
                  src={
                    movie.poster
                      ? `https://image.tmdb.org/t/p/w200${movie.poster}`
                      : "https://via.placeholder.com/150x225?text=No+Image"
                  }
                  alt={movie.title}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
      
                {/* title */}
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    minHeight: "40px",
                    lineHeight: "1.2",
                  }}
                >
                  {movie.title}
                </h3>
                <div style={{ marginTop: "5px" }}>
                   {movie.rating ? (
                    <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: "14px" }}>
                    {/* Display the yellow stars */}
                   {"★".repeat(movie.rating)}
                   {/*Display the grey stars to complete up to 5 */}
                   <span style={{ color: "#555" }}>{"★".repeat(5 - movie.rating)}</span>
                   
                  </span>
                  ) : (
                  <span style={{ color: "#777", fontSize: "12px", fontStyle: "italic" }}>
                Pas de note
              </span>
      )}
    </div>

              </Link>
            ))}
            </div>
          ) : (
            <p style={{ color: "#777", fontStyle: "italic" }}>
              Vous n’avez encore aimé aucun film.
            </p>
          )}
        </div>
      </div>


        {/* Watchlist */}
      {/*  Watchlist */}
<div style={{ marginTop: "50px" }}>
  <h2
    style={{
      fontSize: "1.8rem",
      borderBottom: "3px solid #f5b50a",
      display: "inline-block",
      paddingBottom: "5px",
      marginBottom: "20px",
    }}
  >
     Watchlist
  </h2>

  <div
    style={{
      background: "#2a2a2a",
      padding: "20px",
      borderRadius: "14px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    }}
  >
    {user.watchlist && user.watchlist.length > 0 ? (
      <div  className="scroll-bar-custom"
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "16px",
          padding: "10px 0",
        }}
      >
        {user.watchlist.map((movie) => (
          <Link
            key={movie.tmdbId}
            to={`/movie/${movie.tmdbId}`}
            style={{
              minWidth: "200px",
              maxWidth: "200px",
              background: "#1a1a1a",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
              padding: "10px",
              textAlign: "center",
              color: "inherit",
              textDecoration: "none",
              flexShrink: 0,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 3px 8px rgba(0,0,0,0.10)";
            }}
          >
            {/* Poster */}
            <img
              src={
                movie.poster
                  ? `https://image.tmdb.org/t/p/w200${movie.poster}`
                  : "https://via.placeholder.com/150x225?text=No+Image"
              }
              alt={movie.title}
              style={{
                width: "100%",
                borderRadius: "10px",
                objectFit: "cover",
                marginBottom: "10px",
              }}
            />

            {/* Title */}
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                minHeight: "40px",
                lineHeight: "1.2",
                margin: 0,
              }}
            >
              {movie.title}
            </h3>

            {/* add the... */}
            {movie.addedAt && (
              <p
                style={{
                  marginTop: "4px",
                  color: "#777",
                  fontSize: "0.7rem",
                  fontStyle: "italic",
                }}
              >
                Ajouté le{" "}
                {new Date(movie.addedAt).toLocaleDateString("fr-FR")}
              </p>
            )}
          </Link>
        ))}
      </div>
    ) : (
      <p style={{ color: "#777", fontStyle: "italic" }}>
        Aucun film dans votre watchlist.
      </p>
    )}
  </div>
</div>

    </div>
  
  );
};





export default Profile;