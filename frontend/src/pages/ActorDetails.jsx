import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

// we receive token, user, and setUser
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

        // Verification via the global 'user' object
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
  }, [id, user]); //We add 'user' to the dependencies

  //  Toggle function (Add/Delete)
  const handleFavoriteToggle = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    //CASE 1: DELETION
    if (isFavorite) {
      try {
        await axios.delete(
          `http://localhost:5000/api/users/preferences/actors/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setIsFavorite(false);

        // Global status update
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
    
    // CASE 2: ADDITION
    else {
      try {
        await axios.post(
          `http://localhost:5000/api/users/preferences/actors/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setIsFavorite(true);

        // Global status update
        if (user) {
          const currentActors = user.preferences?.actors || [];
          setUser({
            ...user,
            preferences: {
              ...user.preferences,
              actors: [...currentActors, id] // We add the ID
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
      {/* Main block*/}
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
        {/* Picture */}
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

          {/* Edit button (Toggle) */}
          <button
            onClick={handleFavoriteToggle}
            style={{
              marginTop: "20px",
              // Red if favorite, Yellow if not favorite
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

        {/*Main information*/}
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
               <strong>Date de naissance :</strong> {actor.birthday}
            </p>
          )}

          {actor.place_of_birth && (
            <p style={{ color: "#fff", fontSize: "0.95rem" }}>
               <strong>Lieu de naissance :</strong> {actor.place_of_birth}
            </p>
          )}

          {actor.deathday && (
            <p style={{ color: "fff", fontSize: "0.95rem" }}>
               <strong>Date de décès :</strong> {actor.deathday}
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

      {/* List of films */}
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


