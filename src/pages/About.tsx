// src/pages/About.tsx
import React from "react";
import Navbar from "../components/Navbar";
import BarangayLogo from "../assets/logo.png";
import CitySeal from "../assets/surigaocity_logo.png";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-sans overflow-x-hidden">
      <Navbar />

      {/* About Content */}
      <section className="py-8 md:py-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-20">
            <h1 className="text-3xl md:text-7xl font-black text-green-800 uppercase tracking-tighter leading-none mb-4">
              ABOUT OUR<br />BARANGAY
            </h1>
            <div className="w-24 h-2 bg-yellow-500 mx-auto rounded-full"></div>
          </div>

          <div className="bg-white rounded-[2rem] md:rounded-[4rem] shadow-2xl p-8 md:p-20 text-gray-700 border border-green-50">
            <div className="prose prose-xl max-w-none space-y-8 md:space-y-12">
              <p className="text-xl md:text-3xl leading-relaxed text-gray-600 font-medium italic">
                <span className="text-green-700 font-black not-italic">Barangay Rizal</span> is one of the most progressive and peaceful barangays in Surigao City. 
                Named after the Philippine national hero, <strong className="text-gray-900">Dr. José P. Rizal</strong>, we proudly carry his legacy of patriotism, education, and service to the people.
              </p>

              <div className="bg-green-50 p-6 md:p-12 rounded-3xl border-2 border-dashed border-green-200">
                <h3 className="text-lg md:text-2xl font-black text-green-800 uppercase mb-6 tracking-widest text-center">Our Core Priorities</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  {["Health & Sanitation", "Youth Development", "Peace and Order", "Livelihood Programs", "Environment", "Disaster Preparedness"].map((item) => (
                    <li key={item} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-green-100">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-green-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="font-bold text-sm md:text-xl text-gray-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-center text-lg md:text-3xl font-black text-green-800 pt-8 border-t-2 border-green-100 leading-tight">
                This official website is your digital gateway to transparent governance and efficient public service.
              </p>
            </div>

            {/* Seals at Bottom */}
            <div className="flex justify-center gap-6 md:gap-16 mt-16 md:mt-24">
              <img src={BarangayLogo} alt="Barangay Seal" className="w-20 h-20 md:w-48 md:h-48 rounded-full border-4 md:border-[12px] border-green-700 shadow-2xl transition hover:scale-110 duration-500" />
              <img src={CitySeal} alt="City Seal" className="w-20 h-20 md:w-48 md:h-48 rounded-full border-4 md:border-[12px] border-green-700 shadow-2xl transition hover:scale-110 duration-500" />
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