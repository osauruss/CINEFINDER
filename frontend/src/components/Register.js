// frontend/src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 1000);
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
          Créer un compte
        </h2>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
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
            S’inscrire
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "15px", color: "#2c5364", fontSize: "14px" }}>{message}</p>
        )}

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          Déjà un compte ?{" "}
          <Link to="/login" style={{ color: "#203a43", textDecoration: "none", fontWeight: "500" }}>
            Se connecter
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


//// frontend/src/pages/Register.jsx
//import { useState } from "react";
//import { useNavigate } from "react-router-dom";
//import api from "../api";//

//export default function Register() {
//  const [username, setUsername] = useState("");
//  const [email, setEmail] = useState("");
//  const [password, setPassword] = useState("");
//  const [message, setMessage] = useState("");
//  const navigate = useNavigate();//

//  const handleRegister = async (e) => {
//    e.preventDefault();
//    try {
//      const response = await api.post("/auth/register", {
//        username,
//        email,
//        password,
//      });
//      setMessage(response.data.message);
//      navigate("/login"); // après inscription, redirige vers login
//    } catch (err) {
//      setMessage(err.response?.data?.error || "Erreur serveur");
//    }
//  };//

//  return (
//    <div>
//      <h2>Inscription</h2>
//      <form onSubmit={handleRegister}>
//        <input
//          type="text"
//          placeholder="Nom d'utilisateur"
//          value={username}
//          onChange={(e) => setUsername(e.target.value)}
//          required
//        />
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
//        <button type="submit">S'inscrire</button>
//      </form>
//      <p>{message}</p>
//    </div>
//  );
//}//
