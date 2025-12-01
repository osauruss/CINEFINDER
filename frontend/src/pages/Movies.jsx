import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");

  useEffect(() => {
    if (query) {
      searchMovies(query);
    } else {
      fetchPopularMovies();
    }
  }, [query]);

  const fetchPopularMovies = async () => {
    try {
      setLoading(true);
      const response = await api.get("/movies/popular");
      setMovies(response.data.results);
      setLoading(false);
    } catch (err) {
      console.error("❌ Erreur films populaires :", err);
      setLoading(false);
    }
  };

  const searchMovies = async (search) => {
    try {
      setLoading(true);
      const response = await api.get(`/movies/search?query=${search}`);
      setMovies(response.data.results);
      setLoading(false);
    } catch (err) {
      console.error("❌ Erreur recherche :", err);
      setLoading(false);
    }
  };

  // ⭐⭐⭐ TON CIRCULAR RATING avec note en blanc
  const CircularRating = ({ value }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 10) * circumference;

    const getGradientColors = (score) => {
      if (score >= 7.5) return ["#00c853", "#aeea00"];   // vert
      else if (score >= 4) return ["#ffb300", "#ff6f00"]; // orange
      else return ["#ff3d00", "#dd2c00"];                 // rouge
    };

    const [startColor, endColor] = getGradientColors(value);

    return (
      <div style={{ position: "relative", width: "60px", height: "60px" }}>
        <svg width="60" height="60" style={{ transform: "rotate(-90deg)" }}>
          <circle
            stroke="#e0e0e0"
            fill="transparent"
            strokeWidth="5"
            r={radius}
            cx="30"
            cy="30"
          />

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
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>

        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "14px",
            fontWeight: "600",
            color: "#fff", // Changé en blanc
          }}
        >
          {value.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div style={{ 
      padding: "20px",
      backgroundColor: "#1a1a1a",
      minHeight: "100vh"
    }}>
      {/* Titre en blanc */}
      <h2 style={{ color: "#fff" }}>
        {query ? `Résultats pour : ${query}` : "🎬 Films populaires"}
      </h2>

      {loading ? (
        <p style={{ color: "#fff" }}>Chargement...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, 220px)",
            gap: "30px",
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              style={{
                width: "200px",
                border: "1px solid #333",
                borderRadius: "10px",
                padding: "10px",
                textAlign: "center",
                backgroundColor: "#2a2a2a",
              }}
            >
              <Link
                to={`/movie/${movie.id}`}
                style={{ textDecoration: "none", color: "white" }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  style={{ borderRadius: "10px", width: "100%" }}
                />

                <h3 style={{ fontSize: "16px", marginTop: "10px", color: "#fff" }}>
                  {movie.title}
                </h3>

                {/* ⭐ NOTE ajoutée ici */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                  <CircularRating value={movie.vote_average} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}