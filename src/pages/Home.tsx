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
      <section className="relative min-h-[70vh] md:h-screen flex items-center justify-center overflow-hidden">
        <img
          src={BarangayHall}
          alt="Barangay Rizal Hall"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        <div className="relative z-10 text-center text-white px-4 max-w-6xl w-full">
          <h1 className="text-3xl sm:text-4xl md:text-8xl font-extrabold drop-shadow-2xl mb-2 md:mb-4 tracking-tighter">
            WELCOME TO
          </h1>
          <h2 className="text-5xl sm:text-6xl md:text-9xl font-black text-yellow-400 drop-shadow-2xl leading-[0.9] tracking-tighter">
            BARANGAY<br />RIZAL
          </h2>
          <p className="text-lg sm:text-xl md:text-4xl font-bold mt-4 md:mt-8 opacity-95 text-green-50">
            Your Barangay, Now Online
          </p>
          <p className="text-sm sm:text-base md:text-2xl mt-1 md:mt-4 text-green-200 uppercase tracking-widest font-black">
            Fast • Transparent • Accessible
          </p>

          <div className="flex justify-center gap-4 md:gap-12 mt-8 md:mt-16">
            <img src={BarangayLogo} alt="Seal" className="w-16 h-16 sm:w-20 sm:h-20 md:w-36 md:h-36 rounded-full border-2 md:border-8 border-white shadow-2xl" />
            <img src={CitySeal} alt="City" className="w-16 h-16 sm:w-20 sm:h-20 md:w-36 md:h-36 rounded-full border-2 md:border-8 border-white shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Resident Services - Main Feature Grid */}
      <section className="py-12 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-20">
            <h2 className="text-3xl md:text-6xl font-black text-green-800 mb-4 tracking-tight uppercase">
              Online Services
            </h2>
            <p className="text-lg md:text-2xl text-gray-500 font-medium">
              Apply and report from your smartphone!
            </p>
            <div className="w-20 h-1.5 bg-yellow-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {/* Apply for Certificate */}
            <Link
              to="/apply"
              className="group bg-gradient-to-br from-green-600 to-green-700 text-white p-8 md:p-10 rounded-[2.5rem] shadow-xl hover:shadow-3xl transform active:scale-95 transition-all duration-300 text-center relative overflow-hidden"
            >
              <FaFileAlt className="text-5xl md:text-7xl mx-auto mb-6 group-hover:scale-110 transition" />
              <h3 className="text-xl md:text-2xl font-black mb-3 uppercase">Apply Online</h3>
              <p className="text-green-100 text-sm md:text-base font-medium opacity-80 leading-relaxed">
                Barangay Clearance, Indigency,<br className="hidden md:block" /> and Business Permits
              </p>
              <span className="inline-block mt-6 bg-yellow-500 text-green-900 px-8 py-3 rounded-full font-black text-xs md:text-sm shadow-lg group-hover:bg-white transition">
                START NOW
              </span>
            </Link>

            {/* Submit Complaint */}
            <Link
              to="/complaints"
              className="group bg-gradient-to-br from-red-600 to-red-700 text-white p-8 md:p-10 rounded-[2.5rem] shadow-xl hover:shadow-3xl transform active:scale-95 transition-all duration-300 text-center relative overflow-hidden"
            >
              <FaCommentDots className="text-5xl md:text-7xl mx-auto mb-6 group-hover:scale-110 transition" />
              <h3 className="text-xl md:text-2xl font-black mb-3 uppercase">File Complaint</h3>
              <p className="text-red-100 text-sm md:text-base font-medium opacity-80 leading-relaxed">
                Report noise, peace and order,<br className="hidden md:block" /> or other concerns
              </p>
              <span className="inline-block mt-6 bg-yellow-500 text-red-900 px-8 py-3 rounded-full font-black text-xs md:text-sm shadow-lg group-hover:bg-white transition">
                SUBMIT NOW
              </span>
            </Link>

            {/* Announcements */}
            <Link
              to="/announcements"
              className="group bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 md:p-10 rounded-[2.5rem] shadow-xl hover:shadow-3xl transform active:scale-95 transition-all duration-300 text-center relative overflow-hidden"
            >
              <FaBullhorn className="text-5xl md:text-7xl mx-auto mb-6 group-hover:scale-110 transition" />
              <h3 className="text-xl md:text-2xl font-black mb-3 uppercase">Updates</h3>
              <p className="text-blue-100 text-sm md:text-base font-medium opacity-80 leading-relaxed">
                Stay updated with the latest<br className="hidden md:block" /> news and events
              </p>
              <span className="inline-block mt-6 bg-yellow-500 text-blue-900 px-8 py-3 rounded-full font-black text-xs md:text-sm shadow-lg group-hover:bg-white transition">
                VIEW ALL
              </span>
            </Link>

            {/* Check Status */}
            <Link
              to="/status"
              className="group bg-gradient-to-br from-purple-600 to-purple-700 text-white p-8 md:p-10 rounded-[2.5rem] shadow-xl hover:shadow-3xl transform active:scale-95 transition-all duration-300 text-center relative overflow-hidden"
            >
              <FaSearch className="text-5xl md:text-7xl mx-auto mb-6 group-hover:scale-110 transition" />
              <h3 className="text-xl md:text-2xl font-black mb-3 uppercase">Track Status</h3>
              <p className="text-purple-100 text-sm md:text-base font-medium opacity-80 leading-relaxed">
                Check real-time status of<br className="hidden md:block" /> your applications
              </p>
              <span className="inline-block mt-6 bg-yellow-500 text-purple-900 px-8 py-3 rounded-full font-black text-xs md:text-sm shadow-lg group-hover:bg-white transition">
                CHECK NOW
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-green-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 text-center">
          <div className="flex flex-col items-center">
            <FaMapMarkerAlt className="text-5xl md:text-6xl mb-6 text-yellow-400" />
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Visit Us</h3>
            <p className="text-green-100 text-lg">
              Purok 5, Brgy. Rizal<br />
              Surigao City, Philippines
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaPhone className="text-5xl md:text-6xl mb-6 text-yellow-400" />
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Call Us</h3>
            <p className="text-3xl md:text-4xl font-black text-white">(086) 231-7289</p>
            <p className="text-green-300 text-xs mt-2 font-bold">MON - FRI • 8:00 AM - 5:00 PM</p>
          </div>
          <div className="flex flex-col items-center">
            <FaEnvelope className="text-5xl md:text-6xl mb-6 text-yellow-400" />
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Email Us</h3>
            <p className="text-green-100 text-lg break-all px-4">
              barangayrizal.sc@gmail.com
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