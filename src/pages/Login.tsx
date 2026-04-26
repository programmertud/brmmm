// src/pages/Login.tsx
import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BarangayLogo from "../assets/logo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-sans flex flex-col">
      {/* Compact Responsive Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b-2 md:border-b-4 border-green-700">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5 flex flex-col md:row items-center justify-between gap-3 md:gap-6">
          <div className="flex items-center gap-3 md:gap-5">
            <img src={BarangayLogo} alt="Seal" className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 md:border-4 border-green-700 shadow-lg object-cover" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-green-800 tracking-wider">BARANGAY RIZAL</h1>
              <p className="text-xs md:text-sm text-gray-600 font-medium">City of Surigao</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            <Link to="/" className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-sm md:text-base font-bold shadow-md transition transform hover:scale-105">HOME</Link>
            <Link to="/about" className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-sm md:text-base font-bold shadow-md transition transform hover:scale-105">ABOUT</Link>
            <Link to="/officials" className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-sm md:text-base font-bold shadow-md transition transform hover:scale-105">OFFICIALS</Link>
            <Link to="/login" className="bg-green-700 text-white px-5 md:px-10 py-2 md:py-3 rounded-full text-sm md:text-base font-bold shadow-md transition ring-2 md:ring-4 ring-green-300 border-2 md:border-4 border-white">Staff Login</Link>
          </div>
        </div>
      </header>

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
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 md:px-6 py-3 md:py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 focus:border-green-500 transition text-base md:text-lg" required />

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