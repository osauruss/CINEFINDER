import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api";

export default function Movies({ user }) {
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");

  useEffect(() => {
    if (query) {
      searchMovies(query);
    } else {
      fetchPopularMovies();
      
      if (user && user.preferences?.genres?.length > 0) {
        fetchRecommendations(user.preferences.genres[0]);
      }
    }
  }, [query, user]);

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

  const fetchRecommendations = async (genreId) => {
    try {
      const response = await api.get(`/movies/discover?with_genres=${genreId}`);
      setRecommendations(response.data.results);
    } catch (err) {
      console.error("❌ Erreur recommandations :", err);
    }
  };

  const CircularRating = ({ value }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 10) * circumference;
    const getGradientColors = (score) => {
      if (score >= 7.5) return ["#00c853", "#aeea00"];
      else if (score >= 4) return ["#ffb300", "#ff6f00"];
      else return ["#ff3d00", "#dd2c00"];
    };
    const [startColor, endColor] = getGradientColors(value);

    return (
      <div style={{ position: "relative", width: "60px", height: "60px" }}>
        <svg width="60" height="60" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="30" cy="30" r={radius} stroke="#2a2a2a" strokeWidth="5" fill="transparent" />
          <circle
            cx="30" cy="30" r={radius} stroke={`url(#grad-${value})`} strokeWidth="5" fill="transparent"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
          <defs>
            <linearGradient id={`grad-${value}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>
        </svg>
        <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "14px", fontWeight: "600", color: "white" }}>
          {value ? value.toFixed(1) : "0.0"}
        </span>
      </div>
    );
  };

  const MovieCard = ({ movie, style = {} }) => (
    <div
      style={{
        width: "200px",
        minWidth: "200px",
        border: "1px solid #2a2a2a",
        borderRadius: "10px",
        padding: "10px",
        textAlign: "center",
        backgroundColor: "#2a2a2a",
        boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
        ...style
      }}
    >
      <Link to={`/movie/${movie.tmdbId || movie.id}`} style={{ textDecoration: "none", color: "black" }}>
        <img
          src={
            (movie.poster_path || movie.poster) 
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path || movie.poster}`
            : "https://via.placeholder.com/200x300?text=No+Image"
          }
          alt={movie.title}
          style={{ borderRadius: "10px", width: "100%", height: "300px", objectFit: "cover" }}
        />
        <h3 style={{ fontSize: "16px", marginTop: "10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color:"white" }}>
          {movie.title}
        </h3>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", color:"white" }}>
           {movie.vote_average !== undefined && <CircularRating value={movie.vote_average} />}
        </div>
      </Link>
    </div>
  );

  // ✅ CORRECTION : Retirer scrollbarWidth
  const scrollContainerStyle = {
    display: "flex",
    overflowX: "auto",
    gap: "20px",
    paddingBottom: "20px",
    marginBottom: "40px",
    // scrollbarWidth retiré pour laisser le CSS personnalisé s'appliquer
  };

  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "30px",
  };

  return (
    <div style={{ 
      padding: "30px", 
      maxWidth: "1200px", 
      margin: "0 auto", 
      fontFamily: "Inter, sans-serif", 
      color:"white",
      minHeight: "100vh" 
    }}>
      
      {query ? (
        <>
           <h2>🔍 Résultats pour : "{query}"</h2>
           {loading ? <p>Chargement...</p> : (
             <div style={gridContainerStyle}>
               {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
             </div>
           )}
        </>
      ) : (
        <>
          {user && user.watchlist && user.watchlist.length > 0 && (
             <section>
               <h2 style={{ borderBottom: "3px solid #f5b50a", display: "inline-block", marginBottom: "20px", color: "#fff" }}>
                  📋 Ma Watchlist
               </h2>
               <div className="scroll-bar-custom" style={scrollContainerStyle}>
                 {user.watchlist.map((m) => <MovieCard key={m.tmdbId} movie={m} />)}
               </div>
             </section>
          )}

          <section>
             <h2 style={{ borderBottom: "3px solid #f5b50a", display: "inline-block", marginBottom: "20px" ,color: "#ffffffff"}}> Films Populaires</h2>
             {loading ? <p>Chargement...</p> : (
               <div style={gridContainerStyle}>
                 {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
               </div>
             )}
          </section>

          {user && recommendations.length > 0 && (
             <section style={{ marginTop: "50px" }}>
               <h2 style={{ borderBottom: "3px solid #00c853", display: "inline-block", marginBottom: "20px", color: "#fff" }}>
                  ✨ Recommandés pour vous
               </h2>
              <div className="scroll-bar-custom" style={scrollContainerStyle}>
                 {recommendations.map((m) => <MovieCard key={m.id} movie={m} />)}
               </div>
             </section>
          )}
        </>
      )}
    </div>
  );
}