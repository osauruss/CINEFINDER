import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Profile = ({ token, user }) => {
  // État pour stocker les objets complets des acteurs (nom, image, id...)
  const [favActors, setFavActors] = useState([]);

  // useEffect pour récupérer les détails des acteurs favoris
  useEffect(() => {
    const fetchFavActors = async () => {
      // On vérifie si l'utilisateur a des préférences et des acteurs enregistrés (IDs)
      if (user && user.preferences && user.preferences.actors && user.preferences.actors.length > 0) {
        try {
          // On crée une liste de requêtes pour chaque ID d'acteur
          // On utilise la même route que dans ActorDetails : /api/actors/details/:id
          const promises = user.preferences.actors.map((id) =>
            axios.get(`http://localhost:5000/api/actors/details/${id}`)
          );

          // On attend que toutes les requêtes soient finies
          const responses = await Promise.all(promises);

          // On extrait les données (.data) de chaque réponse
          setFavActors(responses.map((res) => res.data));
        } catch (err) {
          console.error("Erreur lors du chargement des acteurs favoris :", err);
        }
      }
    };

    fetchFavActors();
  }, [user]); // Se relance si l'objet user change

  if (!token) return <p>❌ Vous devez être connecté pour voir votre profil.</p>;
  if (!user) return <p>Chargement du profil...</p>;

  // Tri des films likés
  const sortedLikedMovies = [...(user.likedMovies || [])].sort((a, b) => a.rating - b.rating);

  // Composant note circulaire
  const CircularRating = ({ value }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 10) * circumference;

    return (
      <div style={{ position: "relative", width: "60px", height: "60px" }}>
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
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>👤 Profil de {user.username}</h2>
      <p><strong>Email :</strong> {user.email}</p>
      
      {/* 🎯 Préférences */}
      <div style={{ marginTop: "20px", background: "#f8f8f8", padding: "15px", borderRadius: "10px" }}>
        <h3>🎯 Préférences</h3>
        <p><strong>Genres favoris :</strong> {user.preferences?.genres?.join(", ") || "Aucun"}</p>

        {/* Section Acteurs Favoris */}
        <h4 style={{ marginTop: "20px", marginBottom: "15px" }}>Acteurs favoris</h4>
        
        {favActors.length > 0 ? (
          <div
            style={{
              display: "flex",
              overflowX: "auto", // Permet le scroll horizontal comme pour les films
              gap: "20px",
              padding: "15px 0",
            }}
          >
            {favActors.map((actor) => (
              <Link
                key={actor.id}
                to={`/actor/${actor.id}`} // Redirection vers la page de l'acteur
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  minWidth: "140px",
                  textAlign: "center",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  padding: "10px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  display: "block" // Important pour que le Link prenne la forme du bloc
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
                    height: "180px", // On fixe une hauteur pour l'uniformité
                    objectFit: "cover"
                  }}
                />
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#222",
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

     {/* ⭐ Films aimés */}
<div style={{ marginTop: "40px" }}>
  <h3 style={{ marginBottom: "15px" }}>⭐ Films aimés</h3>

  {sortedLikedMovies.length > 0 ? (
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        gap: "20px",
        paddingBottom: "15px",
      }}
    >
      {sortedLikedMovies.map((movie) => (
        <div
          key={movie.tmdbId}
          style={{
            minWidth: "180px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            padding: "10px",
            textAlign: "center",
            flexShrink: 0,
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
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
          <Link
            to={`/movie/${movie.tmdbId}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster || ""}`}
              alt={movie.title}
              style={{ borderRadius: "10px", width: "100%" }}
            />

            <h4 style={{ marginTop: "8px", fontSize: "15px" }}>
              {movie.title}
            </h4>

            {/* tu peux enlever rating si tu veux */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "6px" }}>
              <CircularRating value={movie.rating || 70} />
            </div>
          </Link>
        </div>
      ))}
    </div>
  ) : (
    <p>Aucun film aimé.</p>
  )}
</div>

      {/* 🎬 Watchlist */}
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ marginBottom: "15px" }}>🎬 Watchlist</h3>
        {user.watchlist?.length > 0 ? (
          <div style={{ display: "flex", overflowX: "auto", gap: "20px", paddingBottom: "15px" }}>
            {user.watchlist.map((movie) => (
              <div
                key={movie.tmdbId}
                style={{
                  minWidth: "180px",
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  padding: "10px",
                  textAlign: "center",
                  flexShrink: 0,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
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
                <Link to={`/movie/${movie.tmdbId}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster || ""}`}
                    alt={movie.title}
                    style={{ borderRadius: "10px", width: "100%" }}
                  />
                  <h4 style={{ marginTop: "8px", fontSize: "15px" }}>{movie.title}</h4>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun film dans la watchlist.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;