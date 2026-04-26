/// <reference types="vite/client" />
import axios from "axios";

// Dynamically determine the API URL for maximum compatibility on mobile
const getBaseURL = () => {
  // Check for environment variable first (best practice)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  if (typeof window !== "undefined") {
    // If we are on localhost but the API is expected at /api, 
    // it usually means we are using a proxy or a monorepo structure.
    // This is the most compatible way for Vercel deployments.
    const origin = window.location.origin;
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