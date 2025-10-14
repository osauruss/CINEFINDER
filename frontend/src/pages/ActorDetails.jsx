// frontend/src/pages/ActorDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ActorDetails = () => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const resActor = await axios.get(`http://localhost:5000/api/actors/details/${id}`);
        setActor(resActor.data);

        const resMovies = await axios.get(`http://localhost:5000/api/actors/movies/${id}`);
        setMovies(resMovies.data.cast);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      }
    };
    fetchActor();
  }, [id]);

  if (!actor) return <p>Chargement...</p>;

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "30px", marginBottom: "30px" }}>
        <img
          src={
            actor.profile_path
              ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={actor.name}
          style={{ borderRadius: "15px", width: "300px", height: "auto" }}
        />
        <div>
          <h1 style={{ marginBottom: "10px" }}>{actor.name}</h1>
          <p style={{ color: "#777" }}>
            <strong>Date de naissance :</strong> {actor.birthday || "Inconnue"}
          </p>
          {actor.place_of_birth && (
            <p style={{ color: "#777" }}>
              <strong>Lieu de naissance :</strong> {actor.place_of_birth}
            </p>
          )}
          {actor.biography && (
            <p style={{ marginTop: "20px", lineHeight: "1.5" }}>
              {actor.biography}
            </p>
          )}
        </div>
      </div>

      <h2 style={{ marginBottom: "15px" }}>🎬 Films notables</h2>
      <div style={{ display: "flex", overflowX: "auto", gap: "15px" }}>
        {movies.slice(0, 10).map((movie) => (
          <div key={movie.id} style={{ textAlign: "center", minWidth: "120px" }}>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                  : "https://via.placeholder.com/120x180?text=No+Image"
              }
              alt={movie.title}
              style={{ width: "100px", borderRadius: "10px", marginBottom: "5px" }}
            />
            <p style={{ fontSize: "14px" }}>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActorDetails;
