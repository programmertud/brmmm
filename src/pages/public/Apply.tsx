// src/pages/public/Apply.tsx
import React, { useState } from "react";
import { FaFileAlt, FaCheckCircle, FaCopy } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../services/api";

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
    } catch (err) {
      console.error(err);
      setError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referenceId);
    alert("Reference ID copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <FaFileAlt className="text-8xl text-green-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-green-800">Apply for Certificate</h1>
          <p className="text-xl text-gray-600 mt-4">Fast, Easy, and Online</p>
        </div>

        {submitted ? (
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-600 rounded-3xl p-12 text-center shadow-2xl">
            <FaCheckCircle className="text-9xl text-green-600 mx-auto mb-8" />
            <h2 className="text-5xl font-bold text-green-800 mb-6">Application Submitted!</h2>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md mx-auto">
              <p className="text-2xl font-bold text-gray-700 mb-4">Your Reference ID</p>
              <div className="bg-green-700 text-white text-4xl font-black py-6 px-8 rounded-2xl tracking-wider">
                {referenceId}
              </div>
              <button
                onClick={copyToClipboard}
                className="mt-6 flex items-center gap-3 mx-auto bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold px-8 py-4 rounded-xl text-xl shadow-lg"
              >
                <FaCopy /> Copy Reference ID
              </button>
            </div>

            <div className="mt-10 space-y-4 text-lg">
              <p className="text-green-800 font-bold">Please save this number!</p>
              <p className="text-gray-700">You will need it to check your application status and claim your document.</p>
              <Link
                to="/status"
                className="inline-block mt-6 bg-green-700 hover:bg-green-800 text-white px-12 py-5 rounded-full text-2xl font-bold"
              >
                Check Status Now
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-10 space-y-8">
            {/* Same form fields as before */}
            <div className="grid md:grid-cols-2 gap-8">
              <input type="text" placeholder="Full Name *" required value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl text-lg focus:border-green-600 focus:outline-none transition"
              />
              <input type="text" placeholder="Complete Address in Barangay Rizal *" required value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl text-lg focus:border-green-600 focus:outline-none transition"
              />
            </div>

            <input type="text" placeholder="Contact Number *" required value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl text-lg focus:border-green-600 focus:outline-none transition"
            />

            <select required value={formData.certificateType}
              onChange={(e) => setFormData({ ...formData, certificateType: e.target.value })}
              className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl text-lg focus:border-green-600 focus:outline-none transition"
            >
              <option value="">Select Certificate Type *</option>
              <option>Barangay Clearance</option>
              <option>Certificate of Indigency</option>
              <option>Business Permit</option>
              <option>First Time Job Seeker</option>
              <option>Residency Certificate</option>
            </select>

            <textarea placeholder="Purpose of Request *" required rows={5} value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl text-lg focus:border-green-600 focus:outline-none transition resize-none"
            />

            {error && (
              <p className="text-red-600 font-semibold">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-2xl py-6 rounded-2xl shadow-xl transition transform hover:scale-105"
            >
              {loading ? "SUBMITTING..." : "SUBMIT APPLICATION"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}