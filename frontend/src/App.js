// frontend/src/App.js

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Login from "./components/Login";
import Register from "./components/Register";
import MovieDetails from "./pages/MovieDetails";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import ActorDetails from "./pages/ActorDetails";
import './App.css';


const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          localStorage.setItem("token", token);
          const res = await axios.get("http://localhost:5000/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.user);
        } catch (err) {
          console.error("Erreur de session :", err);
          localStorage.removeItem("token");
          setToken("");
          setUser(null);
        }
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    fetchUserProfile();
  }, [token]);

  return (
    <Router>
      <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
        <Navbar token={token} setToken={setToken} user={user} />
        <Routes>
          <Route path="/" element={<Home token={token} />} />
          <Route path="/movies" element={<Movies user={user} />} />
          <Route path="/profile" element={<Profile token={token} user={user} />} />
          <Route 
           path="/actor/:id" 
           element={<ActorDetails token={token} user={user} setUser={setUser} />} 
          />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/movie/:id"
            element={<MovieDetails token={token} user={user} setUser={setUser} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;