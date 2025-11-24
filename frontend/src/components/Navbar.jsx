import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";

const Navbar = ({ token, setToken, user }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/movies?query=${query}`);
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        backgroundColor: "#222",
        color: "#fff",
        position: "relative",
      }}
    >
      {/* === Zone gauche : Liens + Search === */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          🏠 Accueil
        </Link>

        <Link to="/movies" style={{ color: "#fff", textDecoration: "none" }}>
          🎬 Films
        </Link>

        {/* --- Search Bar compacte --- */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "5px",marginRight :"40px"}}>
          <input
            type="text"
            placeholder="Recherche..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: "5px 8px",
              fontSize: "14px",
              borderRadius: "4px",
              border: "1px solid #444",
              background: "#333",
              color: "white",
              width: "140px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "5px 10px",
              background: "#555",
              border: "none",
              borderRadius: "4px",
              color: "white",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            OK
          </button>
        </form>
      </div>

      {/* === Zone utilisateur à droite === */}
      <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
        {!token ? (
          <>
            <Link
              to="/login"
              style={{ color: "#61dafb", textDecoration: "none", marginRight: "15px" }}
            >
              Se connecter
            </Link>

            <Link to="/register" style={{ color: "#61dafb", textDecoration: "none" }}>
              S’inscrire
            </Link>
          </>
        ) : (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FiUser size={20} />
              {user?.username || "Mon Compte"}
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "35px",
                  right: 0,
                  backgroundColor: "#333",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  zIndex: 10,
                  minWidth: "160px",
                }}
              >
                <Link
                  to="/profile"
                  style={{
                    display: "block",
                    color: "#fff",
                    textDecoration: "none",
                    padding: "8px",
                    borderRadius: "5px",
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  👤 Mon compte
                </Link>

                <button
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ff4d4d",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px",
                    width: "100%",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  <FiLogOut size={18} />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


/*
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi"; // Icônes utilisateur + logout

const Navbar = ({ token, setToken }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // état du menu déroulant

  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprime le token du stockage local
    setToken(""); // Vide le token dans le state React
    navigate("/login"); // Redirige vers la page de connexion
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        backgroundColor: "#222",
        color: "#fff",
      }}
    >
      {/* === Liens à gauche === *}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          🏠 Accueil
        </Link>
        <Link to="/movies" style={{ color: "#fff", textDecoration: "none" }}>
          🎬 Films
        </Link>
      </div>

      {/* === Zone utilisateur à droite === *}
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {!token ? (
          <>
            <Link
              to="/login"
              style={{ color: "#61dafb", textDecoration: "none" }}
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              style={{ color: "#61dafb", textDecoration: "none" }}
            >
              S’inscrire
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              👤 Mon Profil
            </Link>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#ff4d4d",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              🚪 Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; */



/*import React from "react";
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
      {/* Lien vers la page d'accueil *//*}
      <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
        Home
      </Link>

      {/* Lien vers films populaires *//*}
      <Link to="/movies" style={{ color: "#fff", textDecoration: "none" }}>
        🎬 Films
      </Link>

      {/* Si pas connecté → Login et Register *//*}
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

*/
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
