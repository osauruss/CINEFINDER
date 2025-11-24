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

  return (
    <div style={{ padding: "20px" }}>
      <h2>{query ? `Résultats pour : ${query}` : "🎬 Films populaires"}</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, 200px)",
            gap: "20px",
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
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
