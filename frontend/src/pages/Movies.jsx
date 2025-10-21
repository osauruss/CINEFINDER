import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Movies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Récupère les films populaires via ton backend
        const response = await api.get("/movies/popular");
        setMovies(response.data.results);
      } catch (err) {
        console.error("❌ Erreur lors du fetch des films :", err);
      }
    };

    fetchMovies();
  }, []);
  
  const CircularRating = ({ value }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 10) * circumference;

    // 🔹 Fonction pour générer la couleur en fonction de la note

    const getGradientColors = (score) => {
      if (score >= 7.5) {
        // Très bon film → vert dégradé
        return ["#00c853", "#aeea00"];
      } else if (score >= 4) {
        // Moyen → orange
        return ["#ffb300", "#ff6f00"];
      } else {
        // Mauvais → rouge
        return ["#ff3d00", "#dd2c00"];
      }
    };

    const [startColor, endColor] = getGradientColors(value);

    return (
      <div
        style={{
          position: "relative",
          width: "60px",
          height: "60px",
          display: "inline-block",
        }}
      >
        <svg
          width="60"
          height="60"
          style={{
            transform: "rotate(-90deg)", // ✅ commence à 12h et tourne dans le bon sens
          }}
        >
          {/* Cercle de fond (gris clair) */}
          <circle
            stroke="#e0e0e0"
            fill="transparent"
            strokeWidth="5"
            r={radius}
            cx="30"
            cy="30"
          />

          {/* Cercle de progression */}
          <defs>
            <linearGradient id={`grad-${value}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>

          <circle
            stroke={`url(#grad-${value})`}
            fill="transparent"
            strokeWidth="5"
            strokeLinecap="round"
            r={radius}
            cx="30"
            cy="30"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 0.6s ease, stroke 0.6s ease",
            }}
          />
        </svg>

        {/* Texte au centre */}
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "14px",
            fontWeight: "600",
            color: "#222",
          }}
        >
          {value.toFixed(1)}
        </span>
      </div>
    );
  };

  //const CircularRating = ({ value }) => {
  //    const radius = 24;
  //    const circumference = 2 * Math.PI * radius;
  //    const offset = circumference - (value / 10) * circumference;
//
  //    return (
  //      <div style={{ position: "relative", width: "60px", height: "60px" }}>
  //        <svg width="60" height="60">
  //          <circle
  //            stroke="#e0e0e0"
  //            fill="transparent"
  //            strokeWidth="5"
  //            r={radius}
  //            cx="30"
  //            cy="30"
  //          />
  //          <circle
  //            stroke="url(#grad)"
  //            fill="transparent"
  //            strokeWidth="5"
  //            strokeLinecap="round"
  //            r={radius}
  //            cx="30"
  //            cy="30"
  //            strokeDasharray={circumference}
  //            strokeDashoffset={offset}
  //          />
  //          <defs>
  //            <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
  //              <stop offset="0%" stopColor="#FFD700" />
  //              <stop offset="100%" stopColor="#FF8C00" />
  //            </linearGradient>
  //          </defs>
  //        </svg>
  //        <span
  //          style={{
  //            position: "absolute",
  //            top: "50%",
  //            left: "50%",
  //            transform: "translate(-50%, -50%)",
  //            fontSize: "14px",
  //            fontWeight: "600",
  //          }}
  //        >
  //          {value.toFixed(1)}
  //        </span>
  //      </div>
  //    );
  //};


  return (
    <div style={{ padding: "20px" }}>
      <h2>🎬 Films Populaires</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              width: "200px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "center",
              backgroundColor: "#f9f9f9",
            }}
          >
            {/* Lien vers la page détail du film */}
            <Link
              to={`/movie/${movie.id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                style={{ borderRadius: "10px", width: "100%" }}
              />
              <h3 style={{ fontSize: "16px", marginTop: "10px" }}>
                {movie.title}
              </h3>
              {/* Note avec barre de progression */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CircularRating value={movie.vote_average} />
                <span style={{ fontSize: "14px", color: "#666" }}>Note /10</span>
              </div>


              
              
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
