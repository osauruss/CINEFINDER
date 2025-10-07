const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("Erreur MongoDB:", err));

app.get("/", (req, res) => res.send("Backend CineFinder OK 🚀"));

app.listen(process.env.PORT, () => console.log(`Serveur lancé sur ${process.env.PORT}`));


const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
