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

export default Navbar;
