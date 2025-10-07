import React, { useState } from "react";

const Login = () => {
  // State pour stocker les valeurs des champs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Fonction appelée au clic sur le bouton
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    console.log("Email:", email);
    console.log("Password:", password);
    // Ici tu peux envoyer les infos à ton backend pour vérification
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          type="email"
          placeholder="Adresse mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <button type="submit" style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}>
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
