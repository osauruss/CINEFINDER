


///
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Login from "./components/Login";
import Register from "./components/Register";
import MovieDetails from "./pages/MovieDetails";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import ActorDetails from "./pages/ActorDetails";


const App = () => {
  // State pour stocker le token JWT après connexion
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null); // nouvel état utilisateur

  return (
    <Router>
      <Navbar token={token} setToken={setToken} user={user} /> {/* Navbar peut recevoir le token si besoin */}
      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<Home token={token} />} />

        <Route path="/movies" element={<Movies />} /> 
        <Route path="/profile" element={<Profile token={token} />} />
        <Route path="/actor/:id" element={<ActorDetails />} />


        {/* Page Login */}
        <Route
          path="/login"
          element={<Login setToken={setToken} setUser={setUser} />}
        />

        {/* Page Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Page Détails d'un film */}
        <Route path="/movie/:id" element={<MovieDetails token={token} />} />
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