// src/pages/public/Complaints.tsx
import React, { useState } from "react";
import { FaCommentDots, FaPaperPlane } from "react-icons/fa";
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
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
        <FaCommentDots className="text-6xl md:text-8xl text-red-600 mx-auto mb-6 drop-shadow-xl" />
        <h1 className="text-3xl md:text-5xl font-black text-red-800 tracking-tight uppercase">FILE A <span className="text-red-600">COMPLAINT</span></h1>
        <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-2xl mx-auto">Your voice matters. Report concerns safely and we will address them.</p>

        {submitted ? (
          <div className="bg-green-50 border-4 border-green-500 rounded-3xl p-8 md:p-16 mt-10 md:mt-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-black text-green-800 uppercase tracking-tighter">THANK YOU!</h2>
            <p className="text-xl md:text-2xl mt-6 font-medium text-gray-700">Your complaint has been submitted successfully.</p>
            <p className="text-base md:text-lg text-gray-500 mt-4">We will address it within 24-48 hours. Stay safe!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 mt-10 md:mt-12 space-y-6 md:space-y-8 text-left border border-red-50">
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Your Full Name *"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 md:px-6 py-4 md:py-5 border-2 border-gray-200 rounded-2xl text-base md:text-lg focus:border-red-600 focus:outline-none transition"
              />
              <input
                type="text"
                placeholder="Contact Number or Email *"
                required
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-5 md:px-6 py-4 md:py-5 border-2 border-gray-200 rounded-2xl text-base md:text-lg focus:border-red-600 focus:outline-none transition"
              />
              <input
                type="text"
                placeholder="Subject *"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-5 md:px-6 py-4 md:py-5 border-2 border-gray-200 rounded-2xl text-base md:text-lg focus:border-red-600 focus:outline-none transition"
              />
              <textarea
                placeholder="Describe your concern in detail *"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-5 md:px-6 py-4 md:py-5 border-2 border-gray-200 rounded-2xl text-base md:text-lg focus:border-red-600 focus:outline-none transition resize-none"
              />
            </div>

            {error && <p className="text-red-600 font-bold text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-xl md:text-2xl py-5 md:py-6 rounded-2xl shadow-xl flex items-center justify-center gap-4 transition active:scale-95"
            >
              <FaPaperPlane /> {loading ? "SENDING..." : "SUBMIT COMPLAINT"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}