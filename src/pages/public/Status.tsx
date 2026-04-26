// src/pages/public/Status.tsx
import React, { useState } from "react";
import { FaSearch, FaClock, FaCheckCircle, FaTimesCircle, FaHome, FaPhone, FaInfoCircle } from "react-icons/fa";
import api from "../../services/api";

export default function Status() {
  const [refId, setRefId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const trimmed = refId.trim();
      const response = await api.get(`/applications/${encodeURIComponent(trimmed)}`);
      setResult(response.data);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setResult({ status: "Not Found" });
      } else {
        console.error(err);
        setError("Unable to check status right now. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Header */}
        <FaSearch className="text-8xl text-purple-600 mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-purple-800">Check Application Status</h1>
        <p className="text-xl text-gray-600 mt-4">
          Enter your Reference ID (e.g., BR-2025-11-00123)
        </p>

        {/* Search Form */}
        <form onSubmit={checkStatus} className="mt-12">
          <div className="flex flex-col md:flex-row gap-6 max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="BR-2025-11-00876"
              value={refId}
              onChange={(e) => setRefId(e.target.value)}
              className="flex-1 px-8 py-6 text-2xl border-4 border-purple-300 rounded-2xl focus:border-purple-700 outline-none text-center font-mono tracking-widest uppercase"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-700 hover:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-xl transition transform hover:scale-105"
            >
              {loading ? "CHECKING..." : "CHECK STATUS"}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-4 text-red-600 font-semibold">
            {error}
          </p>
        )}

        {/* Result */}
        {result && (
          <div className="mt-16 bg-white rounded-3xl shadow-2xl p-10 overflow-hidden">
            {result.status === "Not Found" ? (
              <div className="text-center py-16">
                <FaTimesCircle className="text-9xl text-red-600 mx-auto mb-8" />
                <h2 className="text-4xl font-bold text-red-700">Reference ID Not Found</h2>
                <p className="text-xl text-gray-600 mt-6">
                  Please double-check your Reference ID and try again.
                </p>
              </div>
            ) : (
              <>
                {/* Status Header */}
                <div className="text-center mb-10">
                  <h2 className="text-6xl font-black text-purple-800">
                    {result.status === "Pending" ? "UNDER REVIEW" : "READY FOR PICKUP!"}
                  </h2>
                  <p className="text-2xl text-gray-600 mt-4">Reference ID: <span className="font-black text-green-700">{result.reference_id}</span></p>
                </div>

                {/* Status Icon */}
                <div className="flex justify-center mb-10">
                  {result.status === "Pending" ? (
                    <FaClock className="text-9xl text-orange-500 animate-pulse" />
                  ) : (
                    <FaCheckCircle className="text-9xl text-green-500" />
                  )}
                </div>

                {/* Details Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-10 border-4 border-green-300">
                  <h3 className="text-3xl font-bold text-green-800 mb-8 text-center">
                    Application Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8 text-left text-lg">
                    <div className="space-y-5">
                      <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-2xl text-green-700 mt-1" />
                        <div>
                           <p className="font-bold text-green-800">Full Name</p>
                           <p className="text-gray-700">{result.first_name}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FaHome className="text-2xl text-green-700 mt-1" />
                        <div>
                           <p className="font-bold text-green-800">Address</p>
                           <p className="text-gray-700">{result.details?.address || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FaPhone className="text-2xl text-green-700 mt-1" />
                        <div>
                           <p className="font-bold text-green-800">Contact</p>
                           <p className="text-gray-700">{result.details?.contact || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <p className="font-bold text-green-800 mb-2">Certificate Type</p>
                        <p className="bg-white px-6 py-3 rounded-xl text-green-700 font-semibold text-xl text-center shadow">
                          {result.service_type}
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-green-800 mb-2">Purpose of Request</p>
                        <div className="bg-white p-6 rounded-xl shadow-inner border-2 border-green-200">
                          <p className="italic text-gray-800 leading-relaxed">
                            "{result.details?.purpose || "Not specified"}"
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="font-bold text-green-800 mb-2">Submitted On</p>
                        <p className="text-2xl font-bold text-green-700">
                          {new Date(result.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Message */}
                <div className="mt-12 text-center">
                  {result.status === "Pending" ? (
                    <p className="text-2xl text-orange-600 font-bold">
                      Your application is being processed. Please check again later.
                    </p>
                  ) : (
                    <p className="text-3xl text-green-700 font-black">
                      Your document is ready! Please visit the Barangay Hall with your Reference ID.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}