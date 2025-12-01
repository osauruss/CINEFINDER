import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const MovieDetails = ({ token, user, setUser }) => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);

  // Nouveau : trailer et providers
  const [trailer, setTrailer] = useState(null);
  const [providers, setProviders] = useState(null);

  const [addedToWatchlist, setAddedToWatchlist] = useState(false);
  const [liked, setLiked] = useState(false);

useEffect(() => {
  if (user && user.liked && movie) {
    const isLiked = user.liked.some(
      (item) => String(item.tmdbId) === String(movie.id)
    );
    setLiked(isLiked);
  }
}, [user, movie]);

const handleLikeToggle = async () => {
  if (!token) return alert("Veuillez vous connecter pour liker !");

  if (liked) {
    await axios.delete(
      `http://localhost:5000/api/likedfilms/remove/${movie.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setLiked(false);
    setUser({
      ...user,
      liked: user.likedMovies.filter(
        (item) => String(item.tmdbId) !== String(movie.id)
      ),
    });
  } else {
    await axios.post(
      "http://localhost:5000/api/likedfilms/add",
      {
        tmdbId: movie.id,
        title: movie.title,
        poster: movie.poster_path,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setLiked(true);
    setUser({
      ...user,
      liked: [
        ...user.likedMovies,
        {
          tmdbId: movie.id,
          title: movie.title,
          poster: movie.poster_path,
          addedAt: new Date().toISOString(),
        },
      ],
    });
  }
};


  // ─────────────────────────────────────────────
  // FETCH PRINCIPAL : film + cast + crew
  // ─────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMovie, resCredits] = await Promise.all([
          axios.get(`http://localhost:5000/api/movies/details/${id}`),
          axios.get(`http://localhost:5000/api/movies/credits/${id}`)
        ]);

        setMovie(resMovie.data);
        setCredits(resCredits.data);
      } catch (err) {
        console.error("Erreur movie/credits :", err);
      }
    };

    fetchData();
  }, [id]);

  // ─────────────────────────────────────────────
  // FETCH TRAILER
  // ─────────────────────────────────────────────
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${id}/trailer`);
        setTrailer(res.data.trailerKey || null);
      } catch (err) {
        console.error("Erreur trailer :", err);
      }
    };
    fetchTrailer();
  }, [id]);

  // ─────────────────────────────────────────────
  // FETCH PROVIDERS
  // ─────────────────────────────────────────────
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${id}/providers`);
        setProviders(res.data);
      } catch (err) {
        console.error("Erreur providers :", err);
      }
    };
    fetchProviders();
  }, [id]);

  // ─────────────────────────────────────────────
  // Watchlist : vérifie si déjà ajouté
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (user && user.watchlist && movie) {
      // Utilisation de String() pour éviter les erreurs de type (number vs string)
      const isAlreadyInList = user.watchlist.some(
        (item) => String(item.tmdbId) === String(movie.id)
      );
      setAddedToWatchlist(isAlreadyInList);
    }
  }, [user, movie]);

  // ─────────────────────────────────────────────
  // 🔄 GESTION DU BOUTON (AJOUT / SUPPRESSION)
  // ─────────────────────────────────────────────
  const handleWatchlistToggle = async () => {
    if (!token) return alert("Veuillez vous connecter pour gérer votre watchlist !");

    // CAS 1 : SUPPRESSION (Si déjà ajouté)
    if (addedToWatchlist) {
      try {
        await axios.delete(
          `http://localhost:5000/api/watchlist/remove/${movie.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAddedToWatchlist(false);

        // Mise à jour de l'état global utilisateur (Retrait du film)
        if (user) {
          setUser({
            ...user,
            watchlist: user.watchlist.filter(
              (item) => String(item.tmdbId) !== String(movie.id)
            ),
          });
        }
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la suppression !");
      }
    } 
    
    // CAS 2 : AJOUT (Si pas encore ajouté)
    else {
      try {
        await axios.post(
          "http://localhost:5000/api/watchlist/add",
          {
            tmdbId: movie.id,
            title: movie.title,
            poster: movie.poster_path,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAddedToWatchlist(true);

        // Mise à jour de l'état global utilisateur (Ajout du film)
        if (user) {
          setUser({
            ...user,
            watchlist: [
              ...user.watchlist,
              {
                tmdbId: movie.id,
                title: movie.title,
                poster: movie.poster_path,
                addedAt: new Date().toISOString(),
              },
            ],
          });
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Erreur lors de l'ajout !");
      }
    }
  };

  if (!movie || !credits)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Chargement...</p>;

  const director = credits?.crew?.find((c) => c.job === "Director");
  const leadActor = credits?.cast?.[0];

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Inter, sans-serif",
        color: "white",
        lineHeight: 1.6,
        minHeight: "100vh"
      }}
    >
      {/* ░░░░░░░░░░ Informations du film ░░░░░░░░░░ */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          background: "#282828",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          padding: "30px",
        }}
      >
        {/* Poster */}
        <div style={{ flex: "1 1 300px", textAlign: "center" }}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{
              width: "100%",
              maxWidth: "320px",
              borderRadius: "12px",
              objectFit: "cover",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}
          />
        </div>

        {/* Infos */}
        <div style={{ flex: "2 1 500px" }}>
          <h1 style={{ fontSize: "2.2rem", marginBottom: "10px" }}>
            {movie.title}
          </h1>

          <p style={{ color: "white" }}>
            <strong>Date de sortie :</strong> {movie.release_date}
          </p>

          <p style={{ marginTop: "8px" }}>
            <strong>Note :</strong>{" "}
            <span style={{ color: "#f5c518", fontWeight: "bold" }}>
              ⭐ {movie.vote_average.toFixed(1)}/10
            </span>
          </p>

          <p style={{ marginTop: "20px" }}>
            {movie.overview || "Aucun résumé disponible."}
          </p>

          {/* 🔽 BOUTON MODIFIÉ ICI 🔽 */}
<button
  onClick={handleWatchlistToggle}
  style={{
    marginTop: "15px",
    marginRight: "15px", // ✨ C'est cette ligne qui crée l'espace !
    // Rouge si ajouté (pour retirer), Jaune si pas ajouté
    backgroundColor: addedToWatchlist ? "#e74c3c" : "#f5b50a",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.opacity = "0.9";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.opacity = "1";
  }}
>
  {addedToWatchlist
    ? "❌ Retirer de la Watchlist"
    : "➕ Ajouter à ma Watchlist"}
</button>
{/* 🔼 FIN BOUTON MODIFIÉ 🔼 */}

<button
  onClick={handleLikeToggle}
  style={{
    marginTop: "15px", // J'ai mis 15px ici aussi pour qu'il soit aligné avec l'autre
    backgroundColor: liked ? "#e74c3c" : "#3498db",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  }}
>
  {liked ? "💔 Retirer le Like" : "👍 Like"}
</button>
          <div
            style={{
              marginTop: "20px",
              background: "#181818",
              borderRadius: "10px",
              padding: "15px",
            }}
          >
            <p>🎬 <strong>Réalisateur :</strong> {director?.name || "—"}</p>
            <p>⭐ <strong>Acteur principal :</strong> {leadActor?.name || "—"}</p>
          </div>
        </div>
      </div>

      {/* ░░░░░░░░░░ Trailer vidéo ░░░░░░░░░░ */}
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
      


      {/* 📺 Où regarder */}
      {/* 📺 Où regarder */}
      {providers &&
        (providers.flatrate?.length > 0 ||
          providers.rent?.length > 0 ||
          providers.buy?.length > 0) && (
          <div style={{ marginTop: "45px" }}>
            <h2
              style={{
                fontSize: "1.8rem",
                marginBottom: "25px",
                borderBottom: "3px solid #f5b50a",
                display: "inline-block",
                paddingBottom: "5px",color:"white"
              }}
            >
              Où regarder ?
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* STREAMING */}
              {providers.flatrate?.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: "12px",color:"white" }}>Streaming</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    {providers.flatrate.map((p) => (
                      <div
                        key={p.provider_id}
                        style={{
                          width: "100px",
                          textAlign: "center",
                          background: "#2a2a2a",
                          padding: "10px",
                          borderRadius: "12px",
                          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                          transition: "transform 0.2s, box-shadow 0.2s",color:"white"
                        }}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                          alt={p.provider_name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                            marginBottom: "8px",color:"white"
                          }}
                        />
                        <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "white" }}>
                          {p.provider_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LOCATION */}
              {providers.rent?.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: "12px" }}>Location</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    {providers.rent.map((p) => (
                      <div
                        key={p.provider_id}
                        style={{
                          width: "100px",
                          textAlign: "center",
                          background: "#2a2a2a",
                          padding: "10px",
                          borderRadius: "12px",
                          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                        }}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                          alt={p.provider_name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                            marginBottom: "8px",
                          }}
                        />
                        <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#333" }}>
                          {p.provider_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACHAT */}
              {providers.buy?.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: "12px" }}>Achat</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    {providers.buy.map((p) => (
                      <div
                        key={p.provider_id}
                        style={{
                          width: "100px",
                          textAlign: "center",
                          background: "#2a2a2a",
                          padding: "10px",
                          borderRadius: "12px",
                          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                        }}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                          alt={p.provider_name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                            marginBottom: "8px",
                          }}
                        />
                        <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#333" }}>
                          {p.provider_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}





      {/* ░░░░░░░░░░ Distribution ░░░░░░░░░░ */}
      <h2
        style={{
          marginTop: "40px",
          marginBottom: "20px",
          fontSize: "1.8rem",
          borderBottom: "3px solid #f5b50a",
          display: "inline-block",
          paddingBottom: "5px",
        }}
      >
        Distribution principale
      </h2>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "20px",
          padding: "15px 0",
        }}
      >
        {credits.cast.slice(0, 12).map((actor) => (
          <Link
            key={actor.id}
            to={`/actor/${actor.id}`}
            style={{
              minWidth: "140px",
              textAlign: "center",
              textDecoration: "none",
              color: "inherit",
              background: "#2a2a2a",
              padding: "10px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              transition: "0.2s",
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
              }}
            />
            <p style={{ fontWeight: "bold" }}>{actor.name}</p>
            <p style={{ color: "#777", fontStyle: "italic" }}>
              {actor.character || "—"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;
/*
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";


const MovieDetails = ({ token, user, setUser }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [addedToWatchlist, setAddedToWatchlist] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const resMovie = await axios.get(`http://localhost:5000/api/movies/details/${id}`);
        const resCredits = await axios.get(`http://localhost:5000/api/movies/credits/${id}`);
        setMovie(resMovie.data);
        setCredits(resCredits.data);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      }
    };
    fetchMovie();
  }, [id]);


  // Il se déclenche quand 'user' ou 'movie' sont chargés/mis à jour.
  useEffect(() => {
    if (user && user.watchlist && movie) {
      // 👇 CORRECTION : On convertit les deux en String()
      const isAlreadyInList = user.watchlist.some(
        (item) => String(item.tmdbId) === String(movie.id)
      );
      setAddedToWatchlist(isAlreadyInList);
    }
  }, [user, movie]);

 
const director = credits?.crew?.find((c) => c.job === "Director");
const leadActor = credits?.cast?.[0]; // Ajout du ?.[] pour les tableaux



const addToWatchlist = async () => {
    if (!token) return alert("Veuillez vous connecter pour ajouter à la watchlist !");
    try {
      await axios.post(
        "http://localhost:5000/api/watchlist/add",
        {
          tmdbId: movie.id,
          title: movie.title,
          poster: movie.poster_path,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Met à jour l'état local (pour le bouton)
      setAddedToWatchlist(true);

      // 3. ✨ METTRE À JOUR L'ÉTAT GLOBAL (dans App.js) ✨
      // On crée le nouvel objet film tel qu'il sera dans la BDD
      const newWatchlistItem = {
        tmdbId: movie.id,
        title: movie.title,
        poster: movie.poster_path,
        addedAt: new Date().toISOString(), // Simule la date d'ajout
      };

      // On met à jour l'état 'user' dans App.js
      if (user) {
        setUser({
          ...user, // Copie de toutes les infos (username, email...)
          watchlist: [...user.watchlist, newWatchlistItem], // Ajout du nouveau film à la liste
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'ajout !");
    }
  };

  if (!movie || !credits) return <p style={{ textAlign: "center", marginTop: "50px" }}>Chargement...</p>;
  
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Inter, sans-serif",
        color: "#222",
        lineHeight: "1.6",
      }}
    >
      {/* Bloc principal *}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          padding: "30px",
        }}
      >
        {/* Image *}
        <div style={{ flex: "1 1 300px", textAlign: "center" }}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{
              width: "100%",
              maxWidth: "320px",
              borderRadius: "12px",
              objectFit: "cover",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}
          />
        </div>

        {/* Infos principales *}
        <div style={{ flex: "2 1 500px" }}>
          <h1
            style={{
              fontSize: "2.2rem",
              marginBottom: "10px",
              color: "#111",
              fontWeight: "700",
            }}
          >
            {movie.title}
          </h1>
          <p style={{ color: "#666", fontSize: "0.95rem" }}>
            <strong>Date de sortie :</strong> {movie.release_date}
          </p>

          <div style={{ marginTop: "10px", fontSize: "1rem" }}>
            <strong>Note :</strong>{" "}
            <span
              style={{
                color: "#f5c518",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              ⭐ {movie.vote_average.toFixed(1)}/10
            </span>
          </div>

          <p
            style={{
              marginTop: "20px",
              color: "#333",
              fontSize: "1rem",
            }}
          >
            {movie.overview || "Aucun résumé disponible."}
          </p>
          <button
            onClick={addToWatchlist}
            disabled={addedToWatchlist}
            style={{
            marginTop: "15px",
            backgroundColor: addedToWatchlist ? "#4caf50" : "#f5b50a",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: addedToWatchlist ? "default" : "pointer",
            transition: "0.3s",
             }}
            >
            {addedToWatchlist ? "✅ Ajouté à la Watchlist" : "➕ Ajouter à ma Watchlist"}
          </button>

          <div
            style={{
              marginTop: "20px",
              background: "#f8f8f8",
              borderRadius: "10px",
              padding: "15px",
            }}
          >
            <p>
              🎬 <strong>Réalisateur :</strong>{" "}
              {director ? director.name : "Non renseigné"}
            </p>
            <p>
              ⭐ <strong>Acteur principal :</strong>{" "}
              {leadActor ? leadActor.name : "Non renseigné"}
            </p>
          </div>

        </div>
      </div>

      {/* Liste d'acteurs *}
      
      <h2
        style={{
          marginTop: "40px",
          marginBottom: "20px",
          fontSize: "1.8rem",
          borderBottom: "3px solid #f5b50a",
          display: "inline-block",
          paddingBottom: "5px",
        }}
      >
        Distribution principale
      </h2>
      
        <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "20px",
          padding: "15px 0",
        }}
      >
        {credits.cast.slice(0, 12).map((actor) => (
          <Link
            key={actor.id}
            to={`/actor/${actor.id}`}  // <- redirection vers ActorDetails
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
            <p
              style={{
                fontSize: "13px",
                color: "#777",
                fontStyle: "italic",
              }}
            >
              {actor.character || "—"}
            </p>
          </Link>
        ))}

        </div>
      </div>
  );
};

export default MovieDetails;*/

/*
// frontend/src/pages/MovieDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Détails du film
        const resMovie = await axios.get(
          `http://localhost:5000/api/movies/details/${id}`
        );
        setMovie(resMovie.data);

        // Crédits (cast + crew)
        const resCredits = await axios.get(
          `http://localhost:5000/api/movies/credits/${id}`
        );
        setCredits(resCredits.data);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      }
    };
    fetchMovie();
  }, [id]);

  if (!movie || !credits) return <p>Chargement...</p>;

  // Récupérer réalisateur et acteur principal
  const director = credits.crew.find((c) => c.job === "Director");
  const leadActor = credits.cast[0]; // premier acteur listé

  return (
    <div style={{ padding: "20px" }}>
      {/* Conteneur principal *}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {/* Affiche film *}
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          style={{ borderRadius: "10px", flexShrink: 0 }}
        />

        {/* Infos principales *}
        <div style={{ flex: 1 }}>
          <h1 style={{ marginBottom: "10px" }}>{movie.title}</h1>
          <p><strong>Date de sortie :</strong> {movie.release_date}</p>

          {/* Note stylisée *}
          <p>
            <strong>Note :</strong>{" "}
            <span style={{ color: "#ffcc00", fontSize: "18px" }}>
              {"⭐".repeat(Math.round(movie.vote_average / 2))}
            </span>{" "}
            ({movie.vote_average}/10)
          </p>

          {/* Résumé *}
          <p style={{ marginTop: "15px" }}><strong>Résumé :</strong> {movie.overview}</p>

          {/* Réalisateur et acteur principal *}
          <p style={{ marginTop: "10px" }}>
            <strong>Réalisateur :</strong> {director ? director.name : "N/A"}
            <br />
            <strong>Acteur principal :</strong> {leadActor ? leadActor.name : "N/A"}
          </p>
        </div>
      </div>

      {/* Liste d'acteurs *}
      <h3>🎭 Acteurs</h3>
      <div style={{ display: "flex", overflowX: "auto", gap: "15px", padding: "10px 0" }}>
        {credits.cast.slice(0, 10).map((actor) => (
          <div
            key={actor.id}
            style={{
              minWidth: "120px",
              textAlign: "center",
            }}
          >
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                  : "https://via.placeholder.com/120x180?text=No+Image"
              }
              alt={actor.name}
              style={{ width: "100px", borderRadius: "8px", marginBottom: "5px" }}
            />
            <p style={{ fontSize: "14px" }}>{actor.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;*/

/*
// frontend/src/pages/MovieDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MovieDetails = () => {
  const { id } = useParams(); // récupère :id depuis l’URL
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/details/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      }
    };
    fetchMovie();
  }, [id]);

  if (!movie) return <p>Chargement...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{movie.title}</h2>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        style={{ width: "300px", borderRadius: "10px" }}
      />
      <p><strong>Date de sortie :</strong> {movie.release_date}</p>
      <p><strong>Note :</strong> ⭐ {movie.vote_average}/10</p>
      <p><strong>Résumé :</strong> {movie.overview}</p>
    </div>
  );
};

export default MovieDetails;*/
