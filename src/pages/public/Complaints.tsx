// src/pages/public/Complaints.tsx
import React, { useState } from "react";
import { FaCommentDots, FaPaperPlane } from "react-icons/fa";
import api from "../../services/api";

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
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <FaCommentDots className="text-8xl text-red-600 mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-red-800">File a Complaint</h1>
        <p className="text-xl text-gray-600 mt-4">Your voice matters. Report concerns safely.</p>

        {submitted ? (
          <div className="bg-green-100 border-4 border-green-500 rounded-3xl p-16 mt-12">
            <h2 className="text-4xl font-bold text-green-800">Thank You!</h2>
            <p className="text-2xl mt-6">Your complaint has been submitted.</p>
            <p className="text-lg text-gray-700 mt-4">We will address it within 24-48 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-10 mt-12 space-y-8">
            <input
              type="text"
              placeholder="Your Full Name *"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl text-lg focus:border-red-600"
            />
            <input
              type="text"
              placeholder="Contact Number or Email *"
              required
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl text-lg focus:border-red-600"
            />
            <input
              type="text"
              placeholder="Subject *"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl text-lg focus:border-red-600"
            />
            <textarea
              placeholder="Describe your concern in detail *"
              required
              rows={8}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl text-lg focus:border-red-600 resize-none"
            />

            {error && (
              <p className="text-red-600 font-semibold text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-2xl py-6 rounded-2xl shadow-xl flex items-center justify-center gap-4 transition"
            >
              <FaPaperPlane /> {loading ? "SENDING..." : "SUBMIT COMPLAINT"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}