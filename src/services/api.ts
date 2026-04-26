/// <reference types="vite/client" />
import axios from "axios";

// Standard relative path is the most reliable for Vercel deployments
const getBaseURL = () => {
  // Allow override for local development if needed
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  // Using "/api" directly works perfectly on both Vercel and local (with proxy)
  return "/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;