/// <reference types="vite/client" />
import axios from "axios";

// Relative path is the absolute most reliable for Vercel + Mobile
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return "/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;