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
              <p>⭐ {movie.vote_average}/10</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
