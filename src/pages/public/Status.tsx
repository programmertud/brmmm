// src/pages/public/Status.tsx
import React, { useState } from "react";
import { FaSearch, FaClock, FaCheckCircle, FaTimesCircle, FaHome, FaPhone, FaInfoCircle } from "react-icons/fa";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white font-sans overflow-x-hidden">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
        {/* Header */}
        <FaSearch className="text-6xl md:text-8xl text-purple-600 mx-auto mb-6 drop-shadow-xl" />
        <h1 className="text-3xl md:text-5xl font-black text-purple-800 tracking-tight uppercase">CHECK <span className="text-purple-600">STATUS</span></h1>
        <p className="text-lg md:text-xl text-gray-600 mt-4 px-2">
          Enter your Reference ID (e.g., BR-2025-11-00123)
        </p>

        {/* Search Form */}
        <form onSubmit={checkStatus} className="mt-10 md:mt-12">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="BR-XXXX-XXXX"
              value={refId}
              onChange={(e) => setRefId(e.target.value)}
              className="flex-1 px-6 md:px-8 py-4 md:py-6 text-xl md:text-2xl border-4 border-purple-200 rounded-2xl focus:border-purple-600 outline-none text-center font-mono tracking-widest uppercase transition-all"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-700 hover:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 md:px-12 py-4 md:py-6 rounded-2xl text-lg md:text-xl font-black shadow-xl transition transform active:scale-95"
            >
              {loading ? "SEARCHING..." : "SEARCH"}
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
          <div className="mt-12 md:mt-16 bg-white rounded-[40px] shadow-2xl p-6 md:p-12 overflow-hidden border-2 border-purple-100">
            {result.status === "Not Found" ? (
              <div className="text-center py-10 md:py-16">
                <FaTimesCircle className="text-7xl md:text-9xl text-red-600 mx-auto mb-8" />
                <h2 className="text-2xl md:text-4xl font-black text-red-700 uppercase">NOT FOUND</h2>
                <p className="text-lg md:text-xl text-gray-500 mt-6 px-4">
                  Please double-check your Reference ID and try again.
                </p>
              </div>
            ) : (
              <>
                {/* Status Header */}
                <div className="text-center mb-8 md:mb-12">
                  <h2 className={`text-4xl md:text-6xl font-black ${result.status === 'Pending' ? 'text-orange-600' : 'text-green-700'}`}>
                    {result.status === "Pending" ? "PENDING" : "APPROVED"}
                  </h2>
                  <p className="text-lg md:text-2xl text-gray-500 mt-4 font-bold">ID: <span className="text-purple-800 font-black">{result.reference_id}</span></p>
                </div>

                {/* Status Icon */}
                <div className="flex justify-center mb-8 md:mb-12">
                  {result.status === "Pending" ? (
                    <FaClock className="text-7xl md:text-9xl text-orange-500 animate-pulse" />
                  ) : (
                    <FaCheckCircle className="text-7xl md:text-9xl text-green-600" />
                  )}
                </div>

                {/* Details Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-[30px] p-6 md:p-10 border-2 border-green-200">
                  <h3 className="text-xl md:text-3xl font-black text-green-800 mb-6 md:mb-8 text-center uppercase tracking-tight">
                    Application Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left text-base md:text-lg">
                    <div className="space-y-4 md:space-y-5">
                      <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-xl md:text-2xl text-green-700 mt-1" />
                        <div>
                           <p className="font-black text-green-800 text-sm md:text-base uppercase tracking-wider">Full Name</p>
                           <p className="text-gray-800 font-bold">{result.first_name}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FaHome className="text-xl md:text-2xl text-green-700 mt-1" />
                        <div>
                           <p className="font-black text-green-800 text-sm md:text-base uppercase tracking-wider">Address</p>
                           <p className="text-gray-800 font-bold">{result.details?.address || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 md:space-y-5">
                      <div>
                        <p className="font-black text-green-800 text-sm md:text-base uppercase tracking-wider mb-2">Service</p>
                        <p className="bg-white px-4 py-2 rounded-xl text-green-700 font-black text-base md:text-lg border border-green-200 shadow-sm">
                          {result.service_type}
                        </p>
                      </div>

                      <div>
                        <p className="font-black text-green-800 text-sm md:text-base uppercase tracking-wider mb-2">Submitted</p>
                        <p className="text-xl md:text-2xl font-black text-green-700">
                          {new Date(result.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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