// src/pages/Login.tsx
import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BarangayLogo from "../assets/logo.png";
import Navbar from "../components/Navbar";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = await login(username, password);
    if (ok) {
      navigate("/admin/dashboard");   
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-sans flex flex-col overflow-x-hidden">
      <Navbar />

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center py-10 md:py-20 px-4 md:px-6">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-12 w-full max-w-md">
          <div className="text-center mb-6 md:mb-10">
            <img src={BarangayLogo} alt="Seal" className="w-20 h-20 md:w-28 md:h-28 mx-auto rounded-full border-4 border-green-700 shadow-2xl mb-4 md:mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Staff Login</h2>
            <p className="text-gray-600 mt-2 text-base md:text-lg px-2">
              Access the Barangay Management System
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 md:px-6 py-3 md:py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 focus:border-green-500 transition text-base md:text-lg" required />
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 md:px-6 py-3 md:py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 focus:border-green-500 transition text-base md:text-lg" required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 font-bold text-xs"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            {error && <p className="text-red-600 text-center font-medium text-base md:text-lg">{error}</p>}

            <button type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 md:py-5 rounded-xl font-bold text-lg md:text-xl shadow-xl transition transform hover:scale-105">
              Sign In
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-10">
            2025 Barangay Rizal • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}