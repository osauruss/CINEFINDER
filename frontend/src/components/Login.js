
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      setToken(response.data.token);
      
      setMessage("Connexion réussie !");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setMessage(err.response?.data?.error || "Erreur serveur");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "40px 50px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontWeight: "600", color: "#203a43" }}>
          Se connecter
        </h2>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Connexion
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "15px",
              color: message.includes("réussie") ? "#2e8b57" : "#d9534f",
              fontSize: "14px",
            }}
          >
            {message}
          </p>
        )}

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          Pas encore de compte ?{" "}
          <Link
            to="/register"
            style={{ color: "#203a43", textDecoration: "none", fontWeight: "500" }}
          >
            S’inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px 15px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s ease",
};

const buttonStyle = {
  marginTop: "10px",
  background: "linear-gradient(135deg, #203a43, #2c5364)",
  color: "white",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "opacity 0.3s ease",
};




//// frontend/src/pages/Login.jsx
//import { useState } from "react";
//import { useNavigate } from "react-router-dom";
//import api from "../api"; // axios configuré vers ton backend
//
//export default function Login({ setToken, setUser }) {
//  const [email, setEmail] = useState("");
//  const [password, setPassword] = useState("");
//  const [message, setMessage] = useState("");
//  const navigate = useNavigate();
//
//  const handleLogin = async (e) => {
//    e.preventDefault();
//    try {
//      // Requête vers ton backend Express
//      const response = await api.post("/auth/login", { email, password });
//      setToken(response.data.token); // sauvegarde le token dans App
//      // ✅ Enregistrer les infos de l'utilisateur connecté
//      setUser(response.data.user);
//      // ✅ Sauvegarder le token localement pour garder la session
//      localStorage.setItem("token", response.data.token);
//      setMessage("Connexion réussie !");
//      navigate("/"); // redirige vers la page d'accueil
//    } catch (err) {
//      setMessage(err.response?.data?.error || "Erreur serveur");
//    }
//  };
//  return (
//    <div style={{ padding: "20px", textAlign: "center" }}>
//      <h2>Connexion</h2>
//
//      <form
//        onSubmit={handleLogin}
//        style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "0 auto" }}
//      >
//        <input
//          type="email"
//          placeholder="Email"
//          value={email}
//          onChange={(e) => setEmail(e.target.value)}
//          required
//          style={{ marginBottom: "10px", padding: "8px" }}
//        />
//        <input
//          type="password"
//          placeholder="Mot de passe"
//          value={password}
//          onChange={(e) => setPassword(e.target.value)}
//          required
//          style={{ marginBottom: "10px", padding: "8px" }}
//        />
//        <button type="submit" style={{ padding: "8px", backgroundColor: "#761a1a", color: "#fff" }}>
//          Se connecter
//        </button>
//      </form>
//
//      <p style={{ marginTop: "10px", color: message.includes("réussie") ? "green" : "red" }}>
//        {message}
//      </p>
//    </div>
//  );
//  /*
//  return (
//    <div>
//      <h2>Connexion</h2>
//      <form onSubmit={handleLogin}>
//        <input
//          type="email"
//          placeholder="Email"
//          value={email}
//          onChange={(e) => setEmail(e.target.value)}
//          required
//        />
//        <input
//          type="password"
//          placeholder="Mot de passe"
//          value={password}
//          onChange={(e) => setPassword(e.target.value)}
//          required
//        />
//        <button type="submit">Se connecter</button>
//      </form>
//      <p>{message}</p>
//    </div>
//  );*/
//}
