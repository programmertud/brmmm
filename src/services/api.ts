/// <reference types="vite/client" />
import axios from "axios";

// Standard relative path is the most reliable for Vercel deployments
const getBaseURL = () => {
  // Allow override for local development if needed
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    // Ensure we have a clean /api suffix with an absolute origin
    return origin.endsWith('/') ? `${origin}api` : `${origin}/api`;
  }

  return "/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;