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
