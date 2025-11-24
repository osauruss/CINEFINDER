import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ActorDetails = () => {
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

        // Vérifier si acteur déjà dans les préférences
        const token = localStorage.getItem("token");
        if (token) {
          const userRes = await axios.get("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsFavorite(userRes.data.preferences?.actors?.includes(id));
        }
      } catch (err) {
        console.error("Erreur de chargement :", err);
      }
    };
    fetchActor();
  }, [id]);

  const handleAddFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/users/preferences/actors/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFavorite(true);
      alert(`${actor.name} a été ajouté à vos acteurs préférés ❤️`);
    } catch (err) {
      console.error("Erreur lors de l’ajout du favori :", err);
      alert("Une erreur est survenue lors de l’ajout aux favoris.");
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
        color: "#222",
        lineHeight: "1.6",
      }}
    >
      {/* Bloc principal */}
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

          {/* ✅ Bouton Ajouter aux favoris */}
          <button
            onClick={handleAddFavorite}
            disabled={isFavorite}
            style={{
              marginTop: "20px",
              backgroundColor: isFavorite ? "#ccc" : "#f5b50a",
              color: isFavorite ? "#555" : "#111",
              fontWeight: "600",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: isFavorite ? "default" : "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isFavorite) e.currentTarget.style.backgroundColor = "#ffcc33";
            }}
            onMouseLeave={(e) => {
              if (!isFavorite) e.currentTarget.style.backgroundColor = "#f5b50a";
            }}
          >
            {isFavorite ? "❤️ Déjà dans vos favoris" : "➕ Ajouter aux acteurs préférés"}
          </button>
        </div>

        {/* Infos principales */}
        <div style={{ flex: "2 1 500px" }}>
          <h1
            style={{
              fontSize: "2.2rem",
              marginBottom: "10px",
              color: "#111",
              fontWeight: "700",
            }}
          >
            {actor.name}
          </h1>

          {actor.birthday && (
            <p style={{ color: "#666", fontSize: "0.95rem" }}>
              🎂 <strong>Date de naissance :</strong> {actor.birthday}
            </p>
          )}

          {actor.place_of_birth && (
            <p style={{ color: "#666", fontSize: "0.95rem" }}>
              📍 <strong>Lieu de naissance :</strong> {actor.place_of_birth}
            </p>
          )}

          {actor.deathday && (
            <p style={{ color: "#666", fontSize: "0.95rem" }}>
              🕊️ <strong>Date de décès :</strong> {actor.deathday}
            </p>
          )}

          {actor.biography && (
            <p
              style={{
                marginTop: "20px",
                color: "#333",
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
                color: "#222",
                marginBottom: "2px",
              }}
            >
              {movie.title}
            </p>
            {movie.character && (
              <p
                style={{
                  fontSize: "13px",
                  color: "#777",
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
