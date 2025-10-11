import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = ({ token }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Erreur de récupération du profil :", err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  if (!token) return <p>❌ Vous devez être connecté pour voir votre profil.</p>;
  if (!user) return <p>Chargement...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>👤 Profil de {user.username}</h2>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>ID utilisateur :</strong> {user._id}</p>
      <p><strong>Genres préférés :</strong> {user.preferences?.genres.join(", ") || "Aucun"}</p>
    </div>
  );
};

export default Profile;
