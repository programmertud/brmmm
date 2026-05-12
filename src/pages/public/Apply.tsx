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
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-24">
        <div className="text-center mb-10 md:mb-16">
          <FaFileAlt className="text-6xl md:text-9xl text-green-600 mx-auto mb-4 md:mb-6 drop-shadow-xl" />
          <h1 className="text-3xl md:text-7xl font-black text-green-800 tracking-tighter uppercase leading-none">
            APPLY FOR <br className="md:hidden"/><span className="text-green-600">CERTIFICATE</span>
          </h1>
          <p className="text-base md:text-2xl text-gray-500 mt-4 font-bold uppercase tracking-widest">Fast • Easy • Online</p>
        </div>

        {submitted ? (
          <div className="bg-white border-4 border-green-600 rounded-[2rem] md:rounded-[4rem] p-8 md:p-20 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-green-600"></div>
            <FaCheckCircle className="text-7xl md:text-[150px] text-green-600 mx-auto mb-8 animate-bounce" />
            <h2 className="text-4xl md:text-7xl font-black text-green-800 mb-6 tracking-tighter uppercase leading-none">APPLICATION<br />SUBMITTED!</h2>
            
            <div className="bg-green-50 rounded-[2rem] p-8 md:p-12 shadow-inner border-2 border-green-100 max-w-lg mx-auto">
              <p className="text-xs md:text-lg font-black text-green-700 mb-4 uppercase tracking-widest">Your Reference ID</p>
              <div className="bg-white text-green-700 text-3xl md:text-6xl font-black py-6 md:py-10 px-6 md:px-10 rounded-[1.5rem] md:rounded-[2rem] tracking-tighter shadow-lg border-4 border-green-600 flex items-center justify-center gap-4">
                {referenceId}
              </div>
              <button
                onClick={copyToClipboard}
                className="mt-8 flex items-center justify-center gap-3 w-full bg-green-700 hover:bg-green-800 text-white font-black px-6 py-5 rounded-2xl text-lg md:text-2xl shadow-xl active:scale-95 transition uppercase"
              >
                <FaCopy className="text-xl md:text-3xl" /> COPY REFERENCE ID
              </button>
            </div>

            <div className="mt-12 space-y-6">
              <div className="p-4 md:p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-200 inline-block">
                <p className="text-yellow-800 font-black text-sm md:text-xl uppercase tracking-tight">⚠️ Please save this number carefully!</p>
              </div>
              <p className="text-gray-600 text-base md:text-xl leading-relaxed font-medium">
                Use this ID to check your status. Your document will be ready at the <span className="font-bold text-green-700">Barangay Hall</span> after validation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link
                  to="/status"
                  className="bg-green-700 hover:bg-green-800 text-white px-10 py-5 rounded-full text-xl md:text-2xl font-black shadow-2xl transition transform active:scale-95 uppercase"
                >
                  CHECK STATUS
                </Link>
                <Link
                  to="/"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-10 py-5 rounded-full text-xl md:text-2xl font-black shadow-lg transition transform active:scale-95 uppercase"
                >
                  GO HOME
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl p-6 md:p-16 space-y-6 md:space-y-10 border border-green-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="space-y-2">
                <label className="text-xs font-black text-green-800 uppercase ml-2 tracking-widest">Full Name *</label>
                <input type="text" placeholder="Juan Dela Cruz" required value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-6 py-4 md:py-6 border-2 border-gray-100 rounded-2xl text-lg md:text-2xl focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none transition bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-green-800 uppercase ml-2 tracking-widest">Address *</label>
                <input type="text" placeholder="Purok, Street, Brgy" required value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-6 py-4 md:py-6 border-2 border-gray-100 rounded-2xl text-lg md:text-2xl focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none transition bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="space-y-2">
                <label className="text-xs font-black text-green-800 uppercase ml-2 tracking-widest">Contact Number *</label>
                <input type="text" placeholder="0912 345 6789" required value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-6 py-4 md:py-6 border-2 border-gray-100 rounded-2xl text-lg md:text-2xl focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none transition bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-green-800 uppercase ml-2 tracking-widest">Certificate Type *</label>
                <select required value={formData.certificateType}
                  onChange={(e) => setFormData({ ...formData, certificateType: e.target.value })}
                  className="w-full px-6 py-4 md:py-6 border-2 border-gray-100 rounded-2xl text-lg md:text-2xl focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none transition bg-white"
                >
                  <option value="">Select Certificate *</option>
                  <option>Barangay Clearance</option>
                  <option>Certificate of Indigency</option>
                  <option>Business Permit</option>
                  <option>First Time Job Seeker</option>
                  <option>Residency Certificate</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-green-800 uppercase ml-2 tracking-widest">Purpose of Request *</label>
              <textarea placeholder="e.g. Employment, Scholarship, ID Application" required rows={4} value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full px-6 py-4 md:py-6 border-2 border-gray-100 rounded-2xl text-lg md:text-2xl focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none transition resize-none bg-gray-50"
              />
            </div>

            {error && <p className="text-red-600 font-black text-center animate-shake">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-2xl md:text-4xl py-6 md:py-8 rounded-3xl shadow-2xl transition transform active:scale-95 uppercase tracking-tighter"
            >
              {loading ? "SUBMITTING..." : "SUBMIT APPLICATION"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}