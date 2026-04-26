// src/pages/public/Apply.tsx
import React, { useState } from "react";
import { FaFileAlt, FaCheckCircle, FaCopy } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../services/api";

import Navbar from "../../components/Navbar";

export default function Apply() {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    contact: "",
    certificateType: "",
    purpose: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post("/applications", {
        full_name: formData.fullName,
        address: formData.address,
        contact: formData.contact,
        certificate_type: formData.certificateType,
        purpose: formData.purpose,
      });

      const backendRefId = response.data.reference_id as string;
      setReferenceId(backendRefId);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(`Failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referenceId);
    alert("Reference ID copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-sans overflow-x-hidden">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-10 md:mb-12">
          <FaFileAlt className="text-6xl md:text-8xl text-green-600 mx-auto mb-6 drop-shadow-xl" />
          <h1 className="text-3xl md:text-5xl font-black text-green-800 tracking-tight">APPLY FOR <span className="text-green-600">CERTIFICATE</span></h1>
          <p className="text-lg md:text-xl text-gray-600 mt-3 md:mt-4">Fast, Easy, and Online</p>
        </div>

        {submitted ? (
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-600 rounded-3xl p-6 md:p-12 text-center shadow-2xl">
            <FaCheckCircle className="text-7xl md:text-9xl text-green-600 mx-auto mb-6 md:mb-8" />
            <h2 className="text-3xl md:text-5xl font-black text-green-800 mb-6 tracking-tighter">SUBMITTED!</h2>
            
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl max-w-md mx-auto">
              <p className="text-lg md:text-2xl font-bold text-gray-700 mb-3 md:mb-4">Reference ID</p>
              <div className="bg-green-700 text-white text-3xl md:text-4xl font-black py-4 md:py-6 px-6 md:px-8 rounded-2xl tracking-wider">
                {referenceId}
              </div>
              <button
                onClick={copyToClipboard}
                className="mt-6 flex items-center justify-center gap-3 w-full bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold px-6 py-4 rounded-xl text-lg md:text-xl shadow-lg active:scale-95 transition"
              >
                <FaCopy /> COPY ID
              </button>
            </div>

            <div className="mt-10 space-y-4 px-2">
              <p className="text-green-800 font-bold text-base md:text-lg">Please save this number!</p>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                You will need it to check your application status and claim your document at the Barangay Hall.
              </p>
              <Link
                to="/status"
                className="inline-block mt-6 bg-green-700 hover:bg-green-800 text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-xl md:text-2xl font-bold shadow-xl transition transform hover:scale-105 active:scale-95"
              >
                CHECK STATUS
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 space-y-6 md:space-y-8">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <input type="text" placeholder="Full Name *" required value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-5 md:px-6 py-4 md:py-5 border-2 border-gray-300 rounded-2xl text-base md:text-lg focus:border-green-600 focus:outline-none transition"
              />
              <input type="text" placeholder="Complete Address *" required value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-5 md:px-6 py-4 md:py-5 border-2 border-gray-300 rounded-2xl text-base md:text-lg focus:border-green-600 focus:outline-none transition"
              />
            </div>

            <input type="text" placeholder="Contact Number *" required value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-5 md:px-6 py-4 md:py-5 border-2 border-gray-300 rounded-2xl text-base md:text-lg focus:border-green-600 focus:outline-none transition"
            />

            <select required value={formData.certificateType}
              onChange={(e) => setFormData({ ...formData, certificateType: e.target.value })}
              className="w-full px-5 md:px-6 py-4 md:py-5 border-2 border-gray-300 rounded-2xl text-base md:text-lg focus:border-green-600 focus:outline-none transition bg-white"
            >
              <option value="">Select Certificate Type *</option>
              <option>Barangay Clearance</option>
              <option>Certificate of Indigency</option>
              <option>Business Permit</option>
              <option>First Time Job Seeker</option>
              <option>Residency Certificate</option>
            </select>

            <textarea placeholder="Purpose of Request *" required rows={4} value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-5 md:px-6 py-4 md:py-5 border-2 border-gray-300 rounded-2xl text-base md:text-lg focus:border-green-600 focus:outline-none transition resize-none"
            />

            {error && <p className="text-red-600 font-bold text-center">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-xl md:text-2xl py-5 md:py-6 rounded-2xl shadow-xl transition transform active:scale-95"
            >
              {loading ? "SUBMITTING..." : "SUBMIT APPLICATION"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}