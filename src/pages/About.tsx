// src/pages/About.tsx
import React from "react";
import { Link } from "react-router-dom";
import BarangayLogo from "../assets/logo.png";
import CitySeal from "../assets/surigaocity_logo.png";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-sans">
      {/* Unified Header - Same as Home */}
      <header className="bg-white shadow-xl sticky top-0 z-50 border-b-4 border-green-700">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Logo + Name */}
          <div className="flex items-center gap-3 md:gap-5">
            <img
              src={BarangayLogo}
              alt="Barangay Rizal Seal"
              className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 md:border-4 border-green-700 shadow-xl object-cover"
            />
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-green-800 tracking-wider">
                BARANGAY RIZAL
              </h1>
              <p className="text-xs md:text-sm text-gray-600 font-medium">City of Surigao</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            <Link
              to="/"
              className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-base font-bold shadow-lg transition"
            >
              HOME
            </Link>
            <Link
              to="/about"
              className="bg-green-700 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-base font-bold shadow-lg transition ring-2 md:ring-4 ring-green-300"
            >
              ABOUT
            </Link>
            <Link
              to="/officials"
              className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-base font-bold shadow-lg transition"
            >
              OFFICIALS
            </Link>
            <Link
              to="/login"
              className="bg-yellow-500 hover:bg-yellow-600 text-green-900 px-6 md:px-10 py-2 md:py-3 rounded-full text-xs md:text-base font-bold shadow-xl transition border-2 md:border-4 border-white"
            >
              LOGIN
            </Link>
          </div>

        </div>
      </header>

      {/* About Content */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-green-800 text-center mb-8 md:mb-12">
            About Barangay Rizal
          </h1>

          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-16 text-gray-700 text-base md:text-lg leading-relaxed space-y-6 md:space-y-8">
            <p>
              <strong className="text-green-700 text-xl">Barangay Rizal</strong> is one of the most progressive and peaceful barangays in Surigao City. 
              Named after the Philippine national hero, <strong>Dr. José P. Rizal</strong>, we proudly carry his legacy of patriotism, education, and service to the people.
            </p>

            <p>
              Under the leadership of our dedicated Punong Barangay and Sangguniang Barangay officials, we continue to implement programs focused on:
            </p>

            <ul className="grid md:grid-cols-2 gap-6 mt-8 text-base">
              {["Health & Sanitation", "Education & Youth Development", "Peace and Order", "Livelihood Programs", "Environmental Protection", "Disaster Preparedness"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-2xl text-green-600">Checkmark</span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-center text-xl font-bold text-green-700 mt-12 pt-8 border-t-4 border-green-100">
              This official website is your digital gateway to barangay services, announcements, and real-time updates — 
              bringing transparent and efficient governance closer to every resident.
            </p>

            {/* Seals at Bottom */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 md:mt-16">
              <img src={BarangayLogo} alt="Barangay Seal" className="w-24 h-24 md:w-40 md:h-40 rounded-full border-4 md:border-8 border-green-700 shadow-2xl" />
              <img src={CitySeal} alt="City Seal" className="w-24 h-24 md:w-40 md:h-40 rounded-full border-4 md:border-8 border-green-700 shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <p className="text-xl font-bold">BARANGAY RIZAL • City of Surigao</p>
        <p className="text-sm text-gray-400 mt-2">© 2025 All Rights Reserved</p>
      </footer>
    </div>
  );
}