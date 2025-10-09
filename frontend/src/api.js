import axios from "axios";

// Crée une instance Axios pointant vers ton backend
const api = axios.create({
  baseURL: "http://localhost:5000/api", // l'URL de ton backend
});

export default api;
