import axios from "axios";

const api = axios.create({
  // Use relative path for Vercel deployment (handled by rewrites)
  // Use explicit localhost for local development if needed
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

export default api;