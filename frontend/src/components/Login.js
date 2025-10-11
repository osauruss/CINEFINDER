// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // axios configuré vers ton backend

export default function Login({ setToken, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Requête vers ton backend Express
      const response = await api.post("/auth/login", { email, password });
      setToken(response.data.token); // sauvegarde le token dans App
      // ✅ Enregistrer les infos de l'utilisateur connecté
      setUser(response.data.user);
      // ✅ Sauvegarder le token localement pour garder la session
      localStorage.setItem("token", response.data.token);
      setMessage("Connexion réussie !");
      navigate("/"); // redirige vers la page d'accueil
    } catch (err) {
      setMessage(err.response?.data?.error || "Erreur serveur");
    }
  };
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Connexion</h2>

      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "0 auto" }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px", backgroundColor: "#761a1a", color: "#fff" }}>
          Se connecter
        </button>
      </form>

      <p style={{ marginTop: "10px", color: message.includes("réussie") ? "green" : "red" }}>
        {message}
      </p>
    </div>
  );
  /*
  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      <p>{message}</p>
    </div>
  );*/
}
