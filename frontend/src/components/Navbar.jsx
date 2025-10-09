import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ token, setToken }) => {
  // Fonction de déconnexion (vide le token)
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token"); // optionnel si tu stockes le token
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        padding: "15px",
        backgroundColor: "#222",
      }}
    >
      {/* Lien vers la page d'accueil */}
      <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
        Home
      </Link>

      {/* Lien vers films populaires */}
      <Link to="/movies" style={{ color: "#fff", textDecoration: "none" }}>
        🎬 Films
      </Link>

      {/* Si pas connecté → Login et Register */}
      {!token ? (
        <>
          <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
            Login
          </Link>
          <Link
            to="/register"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Register
          </Link>
        </>
      ) : (
        // Si connecté → bouton de déconnexion
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1px solid #fff",
            color: "#fff",
            cursor: "pointer",
            borderRadius: "5px",
            padding: "5px 10px",
          }}
        >
          🚪 Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;


/*

import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      padding: "15px",
      backgroundColor: "#222",
      color: "#761a1aff"
    }}>
      <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link>
      <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>Login</Link>
      <Link to="/register" style={{ color: "#fff", textDecoration: "none" }}>Register</Link>
    </nav>
  );
};

export default Navbar;*/
