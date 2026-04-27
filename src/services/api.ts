/// <reference types="vite/client" />
import axios from "axios";

// Use /api for EVERYTHING. 
// Locally: handled by vite.config.ts proxy
// Production: handled by vercel.json rewrites
const getBaseURL = () => "/api";

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;