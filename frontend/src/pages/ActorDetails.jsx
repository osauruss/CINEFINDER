import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

// 1. On récupère token, user, et setUser
const ActorDetails = ({ token, user, setUser }) => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const resActor = await axios.get(`http://localhost:5000/api/actors/details/${id}`);
        setActor(resActor.data);

        const resMovies = await axios.get(`http://localhost:5000/api/actors/movies/${id}`);
        setMovies(resMovies.data.cast);

        // 2. Vérification via l'objet 'user' global (plus rapide et fiable)
        if (user && user.preferences && user.preferences.actors) {
           const alreadyFav = user.preferences.actors.some(
             (actorId) => String(actorId) === String(id)
           );
           setIsFavorite(alreadyFav);
        }
      } catch (err) {
        console.error("Erreur de chargement :", err);
      }
    };
    fetchActor();
  }, [id, user]); // On ajoute 'user' aux dépendances

  // 3. Fonction Toggle (Ajout / Suppression)
  const handleFavoriteToggle = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    // CAS 1 : SUPPRESSION
    if (isFavorite) {
      try {
        await axios.delete(
          `http://localhost:5000/api/users/preferences/actors/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setIsFavorite(false);

        // Mise à jour de l'état global
        if (user && user.preferences) {
          setUser({
            ...user,
            preferences: {
              ...user.preferences,
              actors: user.preferences.actors.filter(aId => String(aId) !== String(id))
            }
          });
        }
      } catch (err) {
        console.error("Erreur suppression favori :", err);
        alert("Erreur lors de la suppression.");
      }
    } 
    
    // CAS 2 : AJOUT
    else {
      try {
        await axios.post(
          `http://localhost:5000/api/users/preferences/actors/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setIsFavorite(true);

        // Mise à jour de l'état global
        if (user) {
          const currentActors = user.preferences?.actors || [];
          setUser({
            ...user,
            preferences: {
              ...user.preferences,
              actors: [...currentActors, id] // On ajoute l'ID
            }
          });
        }
      } catch (err) {
        console.error("Erreur ajout favori :", err);
        alert("Erreur lors de l'ajout.");
      }
    }
  };

  if (!actor)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Chargement...</p>;

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Inter, sans-serif",
        color: "#fff",
        lineHeight: "1.6",
      }}
    >
      {/* Bloc principal */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          background: "#2a2a2a",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          padding: "30px",
        }}
      >
        {/* Image */}
        <div style={{ flex: "1 1 300px", textAlign: "center" }}>
          <img
            src={
              actor.profile_path
                ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={actor.name}
            style={{
              width: "100%",
              maxWidth: "320px",
              borderRadius: "12px",
              objectFit: "cover",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}
          />

          {/* ✅ Bouton Modifier (Toggle) */}
          <button
            onClick={handleFavoriteToggle}
            style={{
              marginTop: "20px",
              // Rouge si favori, Jaune si pas favori
              backgroundColor: isFavorite ? "#e74c3c" : "#f5b50a",
              color: isFavorite ? "#fff" : "#111",
              fontWeight: "600",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "0.2s ease",
            }}
            onMouseEnter={(e) => {
               e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
               e.currentTarget.style.opacity = "1";
            }}
          >
            {isFavorite ? "💔 Retirer des favoris" : "❤️ Ajouter aux favoris"}
          </button>
        </div>

        {/* Infos principales */}
        <div style={{ flex: "2 1 500px" }}>
          <h1
            style={{
              fontSize: "2.2rem",
              marginBottom: "10px",
              color: "#fff",
              fontWeight: "700",
            }}
          >
            {actor.name}
          </h1>

          {actor.birthday && (
            <p style={{ color: "#fff", fontSize: "0.95rem" }}>
              🎂 <strong>Date de naissance :</strong> {actor.birthday}
            </p>
          )}

          {actor.place_of_birth && (
            <p style={{ color: "#fff", fontSize: "0.95rem" }}>
              📍 <strong>Lieu de naissance :</strong> {actor.place_of_birth}
            </p>
          )}

          {actor.deathday && (
            <p style={{ color: "fff", fontSize: "0.95rem" }}>
              🕊️ <strong>Date de décès :</strong> {actor.deathday}
            </p>
          )}

          {actor.biography && (
            <p
              style={{
                marginTop: "20px",
                color: "#fff",
                fontSize: "1rem",
                textAlign: "justify",
              }}
            >
              {actor.biography}
            </p>
          )}
        </div>
      </div>

      {/* Liste de films */}
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
        Films notables
      </h2>

      <div

      className="scroll-bar-custom"
        style={{
          
          display: "flex",
          overflowX: "auto",  
          gap: "20px",
          padding: "15px 0",
        }}
      >
        {movies.slice(0, 12).map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              minWidth: "140px",
              textAlign: "center",
              backgroundColor: "#2A2A2A",
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
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                  : "https://via.placeholder.com/120x180?text=No+Image"
              }
              alt={movie.title}
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
                color: "#fff",
                marginBottom: "2px",
              }}
            >
              {movie.title}
            </p>
            {movie.character && (
              <p
                style={{
                  fontSize: "13px",
                  color: "#fff",
                  fontStyle: "italic",
                }}
              >
                {movie.character}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ActorDetails;


//import React, { useEffect, useState } from "react";
//import { useParams, Link } from "react-router-dom";
//import axios from "axios";
//
//const ActorDetails = () => {
//  const { id } = useParams();
//  const [actor, setActor] = useState(null);
//  const [movies, setMovies] = useState([]);
//
//  useEffect(() => {
//    const fetchActor = async () => {
//      try {
//        const resActor = await axios.get(`http://localhost:5000/api/actors/details/${id}`);
//        setActor(resActor.data);
//
//        const resMovies = await axios.get(`http://localhost:5000/api/actors/movies/${id}`);
//        setMovies(resMovies.data.cast);
//      } catch (err) {
//        console.error("Erreur de chargement :", err);
//      }
//    };
//    fetchActor();
//  }, [id]);
//
//  if (!actor) return <p style={{ textAlign: "center", marginTop: "50px" }}>Chargement...</p>;
//
//  return (
//    <div
//      style={{
//        maxWidth: "1100px",
//        margin: "40px auto",
//        padding: "20px",
//        fontFamily: "Inter, sans-serif",
//        color: "#222",
//        lineHeight: "1.6",
//      }}
//    >
//      {/* Bloc principal */}
//      <div
//        style={{
//          display: "flex",
//          flexWrap: "wrap",
//          gap: "30px",
//          background: "#fff",
//          borderRadius: "16px",
//          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//          padding: "30px",
//        }}
//      >
//        {/* Image */}
//        <div style={{ flex: "1 1 300px", textAlign: "center" }}>
//          <img
//            src={
//              actor.profile_path
//                ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
//                : "https://via.placeholder.com/300x450?text=No+Image"
//            }
//            alt={actor.name}
//            style={{
//              width: "100%",
//              maxWidth: "320px",
//              borderRadius: "12px",
//              objectFit: "cover",
//              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
//            }}
//          />
//        </div>
//
//        {/* Infos principales */}
//        <div style={{ flex: "2 1 500px" }}>
//          <h1
//            style={{
//              fontSize: "2.2rem",
//              marginBottom: "10px",
//              color: "#111",
//              fontWeight: "700",
//            }}
//          >
//            {actor.name}
//          </h1>
//
//          {actor.birthday && (
//            <p style={{ color: "#666", fontSize: "0.95rem" }}>
//              🎂 <strong>Date de naissance :</strong> {actor.birthday}
//            </p>
//          )}
//
//          {actor.place_of_birth && (
//            <p style={{ color: "#666", fontSize: "0.95rem" }}>
//              📍 <strong>Lieu de naissance :</strong> {actor.place_of_birth}
//            </p>
//          )}
//
//          {actor.deathday && (
//            <p style={{ color: "#666", fontSize: "0.95rem" }}>
//              🕊️ <strong>Date de décès :</strong> {actor.deathday}
//            </p>
//          )}
//
//          {actor.biography && (
//            <p
//              style={{
//                marginTop: "20px",
//                color: "#333",
//                fontSize: "1rem",
//                textAlign: "justify",
//              }}
//            >
//              {actor.biography}
//            </p>
//          )}
//        </div>
//      </div>
//
//      {/* Liste de films */}
//      <h2
//        style={{
//          marginTop: "40px",
//          marginBottom: "20px",
//          fontSize: "1.8rem",
//          borderBottom: "3px solid #f5b50a",
//          display: "inline-block",
//          paddingBottom: "5px",
//        }}
//      >
//        Films notables
//      </h2>
//
//      <div
//        style={{
//          display: "flex",
//          overflowX: "auto",
//          gap: "20px",
//          padding: "15px 0",
//        }}
//      >
//        {movies.slice(0, 12).map((movie) => (
//          <Link
//            key={movie.id}
//            to={`/movie/${movie.id}`} // redirige vers la page du film
//            style={{
//              textDecoration: "none",
//              color: "inherit",
//              minWidth: "140px",
//              textAlign: "center",
//              backgroundColor: "#ffffff",
//              borderRadius: "12px",
//              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//              padding: "10px",
//              transition: "transform 0.2s ease, box-shadow 0.2s ease",
//            }}
//            onMouseEnter={(e) => {
//              e.currentTarget.style.transform = "translateY(-5px)";
//              e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.15)";
//            }}
//            onMouseLeave={(e) => {
//              e.currentTarget.style.transform = "translateY(0)";
//              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
//            }}
//          >
//            <img
//              src={
//                movie.poster_path
//                  ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
//                  : "https://via.placeholder.com/120x180?text=No+Image"
//              }
//              alt={movie.title}
//              style={{
//                width: "100%",
//                borderRadius: "10px",
//                marginBottom: "8px",
//              }}
//            />
//            <p
//              style={{
//                fontWeight: "bold",
//                fontSize: "14px",
//                color: "#222",
//                marginBottom: "2px",
//              }}
//            >
//              {movie.title}
//            </p>
//            {movie.character && (
//              <p
//                style={{
//                  fontSize: "13px",
//                  color: "#777",
//                  fontStyle: "italic",
//                }}
//              >
//                {movie.character}
//              </p>
//            )}
//          </Link>
//        ))}
//      </div>
//    </div>
//  );
//};
//
//export default ActorDetails;




// frontend/src/pages/ActorDetails.jsx
//import React, { useEffect, useState } from "react";
//import { useParams } from "react-router-dom";
//import axios from "axios";
//
//const ActorDetails = () => {
//  const { id } = useParams();
//  const [actor, setActor] = useState(null);
//  const [movies, setMovies] = useState([]);
//
//  useEffect(() => {
//    const fetchActor = async () => {
//      try {
//        const resActor = await axios.get(`http://localhost:5000/api/actors/details/${id}`);
//        setActor(resActor.data);
//
//        const resMovies = await axios.get(`http://localhost:5000/api/actors/movies/${id}`);
//        setMovies(resMovies.data.cast);
//      } catch (err) {
//        console.error("Erreur de chargement :", err);
//      }
//    };
//    fetchActor();
//  }, [id]);
//
//  if (!actor) return <p>Chargement...</p>;
//
//  return (
//    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
//      <div style={{ display: "flex", gap: "30px", marginBottom: "30px" }}>
//        <img
//          src={
//            actor.profile_path
//              ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
//              : "https://via.placeholder.com/300x450?text=No+Image"
//          }
//          alt={actor.name}
//          style={{ borderRadius: "15px", width: "300px", height: "auto" }}
//        />
//        <div>
//          <h1 style={{ marginBottom: "10px" }}>{actor.name}</h1>
//          <p style={{ color: "#777" }}>
//            <strong>Date de naissance :</strong> {actor.birthday || "Inconnue"}
//          </p>
//          {actor.place_of_birth && (
//            <p style={{ color: "#777" }}>
//              <strong>Lieu de naissance :</strong> {actor.place_of_birth}
//            </p>
//          )}
//          {actor.biography && (
//            <p style={{ marginTop: "20px", lineHeight: "1.5" }}>
//              {actor.biography}
//            </p>
//          )}
//        </div>
//      </div>
//
//      <h2 style={{ marginBottom: "15px" }}>🎬 Films notables</h2>
//      <div style={{ display: "flex", overflowX: "auto", gap: "15px" }}>
//        {movies.slice(0, 10).map((movie) => (
//          <div key={movie.id} style={{ textAlign: "center", minWidth: "120px" }}>
//            <img
//              src={
//                movie.poster_path
//                  ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
//                  : "https://via.placeholder.com/120x180?text=No+Image"
//              }
//              alt={movie.title}
//              style={{ width: "100px", borderRadius: "10px", marginBottom: "5px" }}
//            />
//            <p style={{ fontSize: "14px" }}>{movie.title}</p>
//          </div>
//        ))}
//      </div>
//    </div>
//  );
//};
//
//export default ActorDetails;
