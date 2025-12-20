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

  navigate(`/search?query=${encodeURIComponent(query)}`);
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
      {/*left Zone: favicon + movies*/}
      <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        <Link 
          to="/" 
          style={{ 
            color: "#fff", 
            textDecoration: "none",
            fontSize: "20px",
            fontWeight: "bold",
            letterSpacing: "0.5px"
          }}
        >
          CineFinder
        </Link>

        
      </div>

      {/*  centered research bar  */}
      <form 
        onSubmit={handleSearch} 
        style={{ 
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex", 
          gap: "8px"
        }}
      >
        <input
          type="text"
          placeholder="Rechercher un film..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            borderRadius: "25px",
            border: "none",
            background: "#333",
            color: "white",
            width: "300px",
            outline: "none",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onFocus={(e) => {
            e.target.style.background = "#3a3a3a";
            e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
          }}
          onBlur={(e) => {
            e.target.style.background = "#333";
            e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 24px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "25px",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
          }}
        >
          Rechercher
        </button>
      </form>

      {/*  user zone on the right */}
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
              S'inscrire
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