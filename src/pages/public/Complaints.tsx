// src/pages/public/Complaints.tsx
import React, { useState } from "react";
import { FaCommentDots, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../services/api";

import Navbar from "../../components/Navbar";

export default function Complaints() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post("/complaints", {
        name: formData.name,
        contact: formData.contact,
        subject: formData.subject,
        message: formData.message,
      });

      setSubmitted(true);
      setFormData({ name: "", contact: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
      setError("Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white font-sans overflow-x-hidden">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-20 text-center">
        <FaCommentDots className="text-6xl md:text-[150px] text-red-600 mx-auto mb-6 drop-shadow-2xl animate-pulse" />
        <h1 className="text-3xl md:text-7xl font-black text-red-800 tracking-tighter uppercase leading-none">
          FILE A <br className="md:hidden"/><span className="text-red-600">COMPLAINT</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mt-6 max-w-2xl mx-auto font-medium px-4">
          Your voice matters. Report concerns safely and we will address them promptly.
        </p>

        {submitted ? (
          <div className="bg-white border-4 border-red-500 rounded-[2rem] md:rounded-[4rem] p-8 md:p-20 mt-10 md:mt-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-red-600"></div>
            <h2 className="text-4xl md:text-7xl font-black text-green-700 uppercase tracking-tighter leading-none mb-6">THANK YOU!</h2>
            <p className="text-xl md:text-3xl mt-6 font-bold text-gray-700">Your complaint has been submitted.</p>
            <p className="text-base md:text-xl text-gray-500 mt-4 leading-relaxed">
              We take all reports seriously. Our team will review this and take action within 24-48 hours.
            </p>
            <Link to="/" className="inline-block mt-10 bg-red-700 text-white px-10 py-5 rounded-full font-black text-xl uppercase shadow-xl transition active:scale-95">
              BACK TO HOME
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl p-6 md:p-16 mt-10 md:mt-16 space-y-6 md:space-y-10 text-left border border-red-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="space-y-2">
                <label className="text-xs font-black text-red-800 uppercase ml-2 tracking-widest">Full Name *</label>
                <input
                  type="text"
                  placeholder="Juan Dela Cruz"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 md:py-6 border-2 border-gray-100 rounded-2xl text-lg md:text-2xl focus:border-red-600 focus:ring-4 focus:ring-red-100 outline-none transition bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-red-800 uppercase ml-2 tracking-widest">Contact Info *</label>
                <input
                  type="text"
                  placeholder="0912 345 6789"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-6 py-4 md:py-6 border-2 border-gray-100 rounded-2xl text-lg md:text-2xl focus:border-red-600 focus:ring-4 focus:ring-red-100 outline-none transition bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-red-800 uppercase ml-2 tracking-widest">Subject of Complaint *</label>
              <input
                type="text"
                placeholder="e.g. Noise, Peace & Order, Maintenance"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-6 py-4 md:py-6 border-2 border-gray-100 rounded-2xl text-lg md:text-2xl focus:border-red-600 focus:ring-4 focus:ring-red-100 outline-none transition bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-red-800 uppercase ml-2 tracking-widest">Detailed Description *</label>
              <textarea
                placeholder="Describe the incident or concern in detail..."
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-6 py-4 md:py-6 border-2 border-gray-100 rounded-2xl text-lg md:text-2xl focus:border-red-600 focus:ring-4 focus:ring-red-100 outline-none transition resize-none bg-gray-50"
              />
            </div>

            {error && <p className="text-red-600 font-black text-center animate-shake">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-2xl md:text-4xl py-6 md:py-8 rounded-3xl shadow-2xl flex items-center justify-center gap-4 transition active:scale-95 uppercase tracking-tighter"
            >
              <FaPaperPlane className="text-xl md:text-3xl" /> {loading ? "SENDING..." : "SUBMIT COMPLAINT"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}