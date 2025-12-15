import axios from "axios";

// Crée une instance Axios pointant vers le backend
const api = axios.create({
  baseURL: "http://localhost:5000/api", 
});

export default api;
