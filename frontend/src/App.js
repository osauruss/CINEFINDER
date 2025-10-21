


// frontend/src/App.js

import React, { useState, useEffect } from "react"; // 1. Importer useEffect
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios"; // 2. Importer axios
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Login from "./components/Login";
import Register from "./components/Register";
import MovieDetails from "./pages/MovieDetails";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import ActorDetails from "./pages/ActorDetails";

const App = () => {
  // 3. Essayer de récupérer le token depuis le localStorage pour la persistance
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  // 4. AJOUTER CE USEEFFECT
  // Ce bloc va chercher le profil de l'utilisateur dès qu'un token est disponible
  // et le stocker dans l'état 'user' global.
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          // Stocke le token pour les visites futures
          localStorage.setItem("token", token);
          const res = await axios.get("http://localhost:5000/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.user); // Met à jour l'état 'user' global
        } catch (err) {
          // Si le token est invalide/expiré
          console.error("Erreur de session :", err);
          localStorage.removeItem("token");
          setToken("");
          setUser(null);
        }
      } else {
        // S'il n'y a pas de token (déconnexion)
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    fetchUserProfile();
  }, [token]); // Se déclenche à chaque fois que 'token' change

  return (
    <Router>
      {/* On passe setToken pour permettre la déconnexion */}
      <Navbar token={token} setToken={setToken} user={user} />
      <Routes>
        <Route path="/" element={<Home token={token} />} />
        <Route path="/movies" element={<Movies />} />

        {/* 5. MODIFIER LA ROUTE PROFILE */}
        {/* On passe 'user' pour qu'il n'ait pas à le fetcher lui-même */}
        <Route path="/profile" element={<Profile token={token} user={user} />} />

        <Route path="/actor/:id" element={<ActorDetails />} />
        <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* 6. MODIFIER LA ROUTE MOVIEDETAILS */}
        {/* On passe 'setUser' pour que le composant puisse mettre à jour l'état global */}
        <Route
          path="/movie/:id"
          element={<MovieDetails token={token} user={user} setUser={setUser} />}
        />
      </Routes>
    </Router>
  );
};

export default App;

/*
const App = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar visible sur toutes les pages *//*}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
};

export default App;*/
///