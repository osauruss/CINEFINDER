import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Aventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comédie" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drame" },
  { id: 14, name: "Fantastique" },
  { id: 27, name: "Horreur" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science-Fiction" },
  { id: 53, name: "Thriller" },
];

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("query");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // filtres
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);

      try {
        const res = await axios.get(
          "http://localhost:5000/api/tmdb/search/multi",
          {
            params: {
              query,
              genres: selectedGenres.join(","),
              minRating,
            },
          }
        );

        // On garde uniquement les films
        setResults(res.data.results.filter(r => r.media_type === "movie"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, selectedGenres, minRating]);

  const toggleGenre = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id)
        ? prev.filter((g) => g !== id)
        : [...prev, id]
    );
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto", color: "white" }}>
      <h2>Résultats pour “{query}”</h2>

      {/*  FILTRES */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          margin: "25px 0",
          background: "#2a2a2a",
          padding: "15px",
          borderRadius: "12px",
        }}
      >
        {/* Genres */}
        <div>
          <strong>Genres :</strong>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
            {GENRES.map((g) => (
              <span
                key={g.id}
                onClick={() => toggleGenre(g.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  background: selectedGenres.includes(g.id) ? "#f5b50a" : "#444",
                  color: selectedGenres.includes(g.id) ? "#000" : "#fff",
                }}
              >
                {g.name}
              </span>
            ))}
          </div>
        </div>

        {/* Note min */}
        <div>
          <strong>Note minimale :</strong>
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            style={{
              marginLeft: "10px",
              padding: "6px",
              borderRadius: "6px",
              background: "#444",
              color: "white",
              border: "none",
            }}
          >
            <option value={0}>Toutes</option>
            <option value={5}>5+</option>
            <option value={6}>6+</option>
            <option value={7}>7+</option>
            <option value={8}>8+</option>
          </select>
        </div>
      </div>

      {/* RÉSULTATS */}
      {loading ? (
        <p>Chargement...</p>
      ) : results.length === 0 ? (
        <p>Aucun résultat.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "20px",
          }}
        >
          {results.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                background: "#1a1a1a",
                borderRadius: "12px",
                padding: "10px",
              }}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : "https://via.placeholder.com/300x450"
                }
                alt={movie.title}
                style={{ width: "100%", borderRadius: "10px" }}
              />
              <h4 style={{ margin: "10px 0 5px" }}>{movie.title}</h4>
              <p style={{ fontSize: "0.85rem", color: "#f5b50a" }}>
                ⭐ {movie.vote_average?.toFixed(1)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
