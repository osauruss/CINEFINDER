import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const MovieDetails = ({ token, user, setUser }) => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [providers, setProviders] = useState(null);

  const [addedToWatchlist, setAddedToWatchlist] = useState(false);
  
  // STATUS FOR THE GRADE (0 = not rated)
  const [userRating, setUserRating] = useState(0);

  // FETCH DATA (unchanged)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMovie, resCredits] = await Promise.all([
          axios.get(`http://localhost:5000/api/movies/details/${id}`),
          axios.get(`http://localhost:5000/api/movies/credits/${id}`)
        ]);
        setMovie(resMovie.data);
        setCredits(resCredits.data);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [id]);

 // FETCH TRAILER & PROVIDERS (unchanged...)
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${id}/trailer`);
        setTrailer(res.data.trailerKey || null);
      } catch (err) {}
    };
    fetchTrailer();
  }, [id]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${id}/providers`);
        setProviders(res.data);
      } catch (err) {}
    };
    fetchProviders();
  }, [id]);

// USER STATUS VERIFICATION (Watchlist + Note) 
useEffect(() => {
    if (user && movie) {
      // Watchlist
      if (user.watchlist) {
        setAddedToWatchlist(user.watchlist.some(item => String(item.tmdbId) === String(movie.id)));
      }
      // Note (LikedMovies)
      if (user.likedMovies) {
        const foundMovie = user.likedMovies.find(item => String(item.tmdbId) === String(movie.id));
        // If found, we give a grade, otherwise 0
        setUserRating(foundMovie ? foundMovie.rating : 0);
      }
    }
  }, [user, movie]);

  // TOGGLE WATCHLIST (unchanged) 
  const handleWatchlistToggle = async () => {
    if (!token) return alert("Veuillez vous connecter !");
    if (addedToWatchlist) {
      try {
        await axios.delete(`http://localhost:5000/api/watchlist/remove/${movie.id}`, { headers: { Authorization: `Bearer ${token}` } });
        setAddedToWatchlist(false);
        if (user) setUser({ ...user, watchlist: user.watchlist.filter(item => String(item.tmdbId) !== String(movie.id)) });
      } catch (err) { console.error(err); }
    } else {
      try {
        await axios.post("http://localhost:5000/api/watchlist/add", { tmdbId: movie.id, title: movie.title, poster: movie.poster_path }, { headers: { Authorization: `Bearer ${token}` } });
        setAddedToWatchlist(true);
        if (user) setUser({ ...user, watchlist: [...user.watchlist, { tmdbId: movie.id, title: movie.title, poster: movie.poster_path, addedAt: new Date().toISOString() }] });
      } catch (err) { console.error(err); }
    }
  };

  // RATING FUNCTION
  const handleRate = async (score) => {
    if (!token) return alert("Connectez-vous pour noter ce film !");

    // If we click on the same rating -> We remove the like (rating = 0)
    if (userRating === score) {
      try {
        await axios.delete(`http://localhost:5000/api/liked/remove/${movie.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserRating(0);
        //Global User Update
        if (user) {
          setUser({
            ...user,
            likedMovies: user.likedMovies.filter(m => String(m.tmdbId) !== String(movie.id))
          });
        }
      } catch (err) { console.error(err); }
      return;
    }

    // Otherwise -> We add/update the note
    try {
      await axios.post(
        "http://localhost:5000/api/liked/add",
        {
          tmdbId: movie.id,
          title: movie.title,
          poster: movie.poster_path,
          rating: score //We send the note
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUserRating(score);

      // Global User Update
      if (user) {
        // The old version is removed if there is one to avoid duplicates.
        const others = user.likedMovies.filter(m => String(m.tmdbId) !== String(movie.id));
        setUser({
          ...user,
          likedMovies: [...others, { 
             tmdbId: movie.id, 
             title: movie.title, 
             poster: movie.poster_path, 
             rating: score,
             addedAt: new Date().toISOString()
          }]
        });
      }
    } catch (err) { console.error(err); }
  };

  if (!movie || !credits) return <p style={{ textAlign: "center", marginTop: "50px" }}>Chargement...</p>;
  const director = credits?.crew?.find((c) => c.job === "Director");
  const leadActor = credits?.cast?.[0];

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "20px", fontFamily: "Inter, sans-serif", color: "white", lineHeight: 1.6, minHeight: "100vh" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", background: "#282828", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: "30px" }}>
        
        {/* Poster */}
        <div style={{ flex: "1 1 300px", textAlign: "center" }}>
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} style={{ width: "100%", maxWidth: "320px", borderRadius: "12px", objectFit: "cover", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }} />
        </div>

        {/* Infos */}
        <div style={{ flex: "2 1 500px" }}>
          <h1 style={{ fontSize: "2.2rem", marginBottom: "10px" }}>{movie.title}</h1>
          <p style={{ color: "white" }}><strong>Date de sortie :</strong> {movie.release_date}</p>
          <p style={{ marginTop: "8px" }}><strong>Note :</strong> <span style={{ color: "#f5c518", fontWeight: "bold" }}>⭐ {movie.vote_average.toFixed(1)}/10</span></p>
          <p style={{ marginTop: "20px" }}>{movie.overview || "Aucun résumé disponible."}</p>

          <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
            {/*WATCHLIST BUTTON */}
            <button
              onClick={handleWatchlistToggle}
              style={{
                backgroundColor: addedToWatchlist ? "#e74c3c" : "#f5b50a",
                color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", transition: "0.3s"
              }}
            >
              {addedToWatchlist ? "❌ Retirer Watchlist" : "➕ Ajouter Watchlist"}
            </button>

            {/* RATING SYSTEM*/}
            <div style={{ display: "flex", alignItems: "center", background: "#181818", padding: "5px 15px", borderRadius: "10px" }}>
                <span style={{ marginRight: "10px", fontSize: "0.9rem", color: "#ccc" }}>Votre note :</span>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        onClick={() => handleRate(star)}
                        style={{
                            cursor: "pointer",
                            fontSize: "1.8rem",
                            color: star <= userRating ? "#FFD700" : "#555", // Gold if active, Grey if inactive
                            transition: "transform 0.2s, color 0.2s",
                            marginRight: "2px"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.3)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                        ★
                    </span>
                ))}
            </div>
          </div>

          <div style={{ marginTop: "20px", background: "#181818", borderRadius: "10px", padding: "15px" }}>
            <p> <strong>Réalisateur :</strong> {director?.name || "—"}</p>
            <p> <strong>Acteur principal :</strong> {leadActor?.name || "—"}</p>
          </div>
        </div>
      </div>

      {/* Video trailer */}
      {trailer && (
        <div style={{ marginTop: "40px" }}>
          <h2
            style={{
              fontSize: "1.8rem",
              borderBottom: "3px solid #f5b50a",
              display: "inline-block",
              marginBottom: "15px", color:"white"
            }}
          >
            Bande-annonce
          </h2>

          <iframe
            width="100%"
            height="420"
            src={`https://www.youtube.com/embed/${trailer}`}
            title="Trailer YouTube"
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              border: "none",color:"white"
            }}
            allowFullScreen
          ></iframe>
        </div>
      )}
      
    
      {/* Where to look */}
      {providers &&
        (providers.flatrate?.length > 0 ||
          providers.rent?.length > 0 ||
          providers.buy?.length > 0) && (
          <div style={{ marginTop: "45px" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "25px", borderBottom: "3px solid #f5b50a", display: "inline-block", paddingBottom: "5px",color:"white" }}>
              Où regarder ?
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/*Code providers identical to what you sent me */}
              {providers.flatrate?.length > 0 && (
                <div><h3 style={{ marginBottom: "12px",color:"white" }}>Streaming</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  {providers.flatrate.map((p) => (
                    <div key={p.provider_id} style={{ width: "100px", textAlign: "center", background: "#2a2a2a", padding: "10px", borderRadius: "12px", boxShadow: "0 3px 10px rgba(0,0,0,0.1)", transition: "transform 0.2s, box-shadow 0.2s",color:"white" }}>
                      <img src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} style={{ width: "60px", height: "60px", objectFit: "contain", marginBottom: "8px",color:"white" }} />
                      <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "white" }}>{p.provider_name}</p>
                    </div>
                  ))}
                </div></div>
              )}
           
            </div>
          </div>
        )}

      {/*Distribution*/}
      <h2 style={{ marginTop: "40px", marginBottom: "20px", fontSize: "1.8rem", borderBottom: "3px solid #f5b50a", display: "inline-block", paddingBottom: "5px" }}>
        Distribution principale
      </h2>

      <div className="scroll-bar-custom" style={{ display: "flex", overflowX: "auto", gap: "20px", padding: "15px 0" }}>
        {credits.cast.slice(0, 12).map((actor) => (
          <Link key={actor.id} to={`/actor/${actor.id}`} style={{ minWidth: "140px", textAlign: "center", textDecoration: "none", color: "inherit", background: "#2a2a2a", padding: "10px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", transition: "0.2s" }}>
            <img src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : "https://via.placeholder.com/120x180?text=No+Image"} alt={actor.name} style={{ width: "100%", borderRadius: "10px", marginBottom: "8px" }} />
            <p style={{ fontWeight: "bold" }}>{actor.name}</p>
            <p style={{ color: "#777", fontStyle: "italic" }}>{actor.character || "—"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;