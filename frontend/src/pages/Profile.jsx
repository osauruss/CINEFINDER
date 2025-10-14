import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Profile = ({ token }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Erreur de récupération du profil :", err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  if (!token) return <p>❌ Vous devez être connecté pour voir votre profil.</p>;
  if (!user) return <p>Chargement...</p>;

  // Tri des films likés par note croissante
  const sortedLikedMovies = [...(user.likedMovies || [])].sort((a, b) => a.rating - b.rating);

  // 🎯 Composant d’affichage circulaire de la note
  const CircularRating = ({ value }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 10) * circumference;

    return (
      <div style={{ position: "relative", width: "60px", height: "60px" }}>
        <svg width="60" height="60">
          <circle
            stroke="#e0e0e0"
            fill="transparent"
            strokeWidth="5"
            r={radius}
            cx="30"
            cy="30"
          />
          <circle
            stroke="url(#grad)"
            fill="transparent"
            strokeWidth="5"
            strokeLinecap="round"
            r={radius}
            cx="30"
            cy="30"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
          <defs>
            <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>
          </defs>
        </svg>
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          {value.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>👤 Profil de {user.username}</h2>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>ID utilisateur :</strong> {user._id}</p>

      {/* 🎯 Préférences */}
      <div style={{ marginTop: "20px", background: "#f8f8f8", padding: "15px", borderRadius: "10px" }}>
        <h3>🎯 Préférences</h3>
        <p><strong>Genres :</strong> {user.preferences?.genres?.join(", ") || "Aucun"}</p>
        <p><strong>Acteurs favoris :</strong> {user.preferences?.actors?.join(", ") || "Aucun"}</p>
      </div>

      {/* ⭐ Films aimés */}
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ marginBottom: "15px" }}>⭐ Films aimés (vus)</h3>
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
                <Link to={`/movie/${movie.tmdbId}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path || ""}`}
                    alt={movie.title}
                    style={{ borderRadius: "10px", width: "100%" }}
                  />
                  <h4 style={{ marginTop: "8px", fontSize: "15px" }}>{movie.title}</h4>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                    <CircularRating value={movie.rating || 0} />
                    <span style={{ fontSize: "14px", color: "#555" }}> /10</span>
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
        <h3 style={{ marginBottom: "15px" }}>🎬 Watchlist (à voir plus tard)</h3>
        {user.watchlist?.length > 0 ? (
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "20px",
              paddingBottom: "15px",
            }}
          >
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
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path || ""}`}
                    alt={movie.title}
                    style={{ borderRadius: "10px", width: "100%" }}
                  />
                  <h4 style={{ marginTop: "8px", fontSize: "15px" }}>{movie.title}</h4>
                  <p style={{ fontSize: "13px", color: "#777" }}>Ajouté le : {new Date(movie.addedAt).toLocaleDateString()}</p>
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
