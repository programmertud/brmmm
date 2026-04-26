// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/about" },
    { name: "OFFICIALS", path: "/officials" },
    { name: "STATUS", path: "/status" },
    { name: "ANNOUNCEMENTS", path: "/announcements" },
  ];

  return (
    <nav className="bg-white shadow-xl sticky top-0 z-50 border-b-4 border-green-700">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        {/* Logo & Title */}
        <Link to="/" className="flex items-center gap-3 md:gap-4 group">
          <img
            src={Logo}
            alt="Barangay Rizal Logo"
            className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-green-700 shadow-md transition group-hover:scale-110"
          />
          <div>
            <h1 className="text-lg md:text-2xl font-black text-green-800 tracking-tighter leading-none">
              BARANGAY RIZAL
            </h1>
            <p className="text-[10px] md:text-xs font-bold text-green-600">City of Surigao</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-black transition-all duration-300 ${
                  isActive 
                  ? "bg-green-700 text-white shadow-lg" 
                  : "text-green-800 hover:bg-green-100"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            to="/login"
            className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-green-900 px-6 py-2 rounded-full text-sm font-black shadow-lg transition transform hover:scale-105 border-2 border-white"
          >
            STAFF LOGIN
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-green-800 focus:outline-none"
        >
          {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-green-50 border-t border-green-200 animate-slideDown">
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`p-4 rounded-xl font-black text-center shadow-sm transition ${
                  location.pathname === link.path 
                  ? "bg-green-700 text-white" 
                  : "bg-white text-green-800"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="p-4 bg-yellow-500 text-green-900 rounded-xl font-black text-center shadow-md"
            >
              STAFF LOGIN
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
