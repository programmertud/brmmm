/// <reference types="vite/client" />
import axios from "axios";

// Dynamically determine the API URL for maximum compatibility on mobile
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // This ensures that on Vercel, it uses the full domain name
    return `${window.location.origin}/api`;
  }
  return "/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
});

export default api;