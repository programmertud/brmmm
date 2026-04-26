// src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
  FaFileAlt, 
  FaCommentDots, 
  FaBullhorn, 
  FaSearch, 
  FaFacebook, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaUserShield,
  FaClock,
  FaCheckCircle
} from "react-icons/fa";

import BarangayLogo from "../assets/logo.png";
import CitySeal from "../assets/surigaocity_logo.png";
import BarangayHall from "../assets/logo.png"; // Replace with real photo

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-sans overflow-x-hidden">

      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:h-screen flex items-center justify-center overflow-hidden">
        <img
          src={BarangayHall}
          alt="Barangay Rizal Hall"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="relative z-10 text-center text-white px-4 max-w-6xl">
          <h1 className="text-4xl md:text-8xl font-extrabold drop-shadow-2xl mb-2 md:mb-4">
            WELCOME TO
          </h1>
          <h2 className="text-5xl md:text-9xl font-black text-yellow-400 drop-shadow-2xl leading-tight">
            BARANGAY<br />RIZAL
          </h2>
          <p className="text-xl md:text-4xl font-bold mt-6 md:mt-8 opacity-95">
            Your Barangay, Now Online
          </p>
          <p className="text-base md:text-2xl mt-2 md:mt-4 text-green-200">
            Fast • Transparent • Accessible Services
          </p>

          <div className="flex justify-center gap-6 md:gap-12 mt-10 md:mt-16">
            <img src={BarangayLogo} alt="Seal" className="w-20 h-20 md:w-36 md:h-36 rounded-full border-4 md:border-8 border-white shadow-2xl" />
            <img src={CitySeal} alt="City" className="w-20 h-20 md:w-36 md:h-36 rounded-full border-4 md:border-8 border-white shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Resident Services - Main Feature Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-green-800 mb-4">
            Online Services for Residents
          </h2>
          <p className="text-center text-xl text-gray-600 mb-16">
            Apply, report, and stay updated — all from home!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Apply for Certificate */}
            <Link
              to="/apply"
              className="group bg-gradient-to-br from-green-600 to-green-700 text-white p-10 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-4 transition-all duration-300 text-center"
            >
              <FaFileAlt className="text-7xl mx-auto mb-6 group-hover:scale-110 transition" />
              <h3 className="text-2xl font-bold mb-3">Apply Online</h3>
              <p className="text-green-100">
                Barangay Clearance<br />
                Indigency • Business Permit
              </p>
              <span className="inline-block mt-6 bg-yellow-500 text-green-900 px-6 py-3 rounded-full font-bold">
                Start Now
              </span>
            </Link>

            {/* Submit Complaint */}
            <Link
              to="/complaints"
              className="group bg-gradient-to-br from-red-600 to-red-700 text-white p-10 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-4 transition-all duration-300 text-center"
            >
              <FaCommentDots className="text-7xl mx-auto mb-6 group-hover:scale-110 transition" />
              <h3 className="text-2xl font-bold mb-3">File Complaint</h3>
              <p className="text-red-100">
                Report concerns<br />
                Noise • Peace & Order
              </p>
              <span className="inline-block mt-6 bg-yellow-500 text-red-900 px-6 py-3 rounded-full font-bold">
                Submit Now
              </span>
            </Link>

            {/* Announcements */}
            <Link
              to="/announcements"
              className="group bg-gradient-to-br from-blue-600 to-blue-700 text-white p-10 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-4 transition-all duration-300 text-center"
            >
              <FaBullhorn className="text-7xl mx-auto mb-6 group-hover:scale-110 transition" />
              <h3 className="text-2xl font-bold mb-3">Announcements</h3>
              <p className="text-blue-100">
                Latest news<br />
                Events & Schedules
              </p>
              <span className="inline-block mt-6 bg-yellow-500 text-blue-900 px-6 py-3 rounded-full font-bold">
                View All
              </span>
            </Link>

            {/* Check Status */}
            <Link
              to="/status"
              className="group bg-gradient-to-br from-purple-600 to-purple-700 text-white p-10 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-4 transition-all duration-300 text-center"
            >
              <FaSearch className="text-7xl mx-auto mb-6 group-hover:scale-110 transition" />
              <h3 className="text-2xl font-bold mb-3">Track Status</h3>
              <p className="text-purple-100">
                Check your application<br />
                Real-time updates
              </p>
              <span className="inline-block mt-6 bg-yellow-500 text-purple-900 px-6 py-3 rounded-full font-bold">
                Check Now
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center">
            <FaMapMarkerAlt className="text-6xl mb-4" />
            <h3 className="text-2xl font-bold mb-2">Visit Us</h3>
            <p className="text-green-100">
              Purok 5, Brgy. Rizal<br />
              Surigao City, Philippines
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaPhone className="text-6xl mb-4" />
            <h3 className="text-2xl font-bold mb-2">Call Us</h3>
            <p className="text-3xl font-black">(086) 231-7289</p>
          </div>
          <div className="flex flex-col items-center">
            <FaEnvelope className="text-6xl mb-4" />
            <h3 className="text-2xl font-bold mb-2">Email Us</h3>
            <p className="text-green-100 break-all">
              barangayrizal.surigaocity@gmail.com
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center gap-10 mb-8 text-4xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
              <FaFacebook />
            </a>
          </div>
          <h3 className="text-2xl font-bold mb-2">BARANGAY RIZAL</h3>
          <p className="text-lg text-green-400">City of Surigao</p>
          <p className="text-sm text-gray-400 mt-6">
            © 2025 Barangay Rizal Digital Services • All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}