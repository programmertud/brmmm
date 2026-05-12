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
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-24 text-center">
        {/* Header */}
        <FaSearch className="text-6xl md:text-[150px] text-purple-600 mx-auto mb-6 drop-shadow-2xl animate-pulse" />
        <h1 className="text-3xl md:text-7xl font-black text-purple-800 tracking-tighter uppercase leading-none">
          TRACK YOUR <br className="md:hidden"/><span className="text-purple-600">STATUS</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mt-6 max-w-2xl mx-auto font-medium px-4">
          Enter your Reference ID to see the progress of your application.
        </p>

        {/* Search Form */}
        <form onSubmit={checkStatus} className="mt-10 md:mt-16">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="BR-XXXX-XXXX"
              value={refId}
              onChange={(e) => setRefId(e.target.value)}
              className="flex-1 px-6 md:px-10 py-5 md:py-8 text-2xl md:text-4xl border-4 border-purple-200 rounded-[1.5rem] md:rounded-[2.5rem] focus:border-purple-600 outline-none text-center font-mono tracking-widest uppercase transition-all shadow-inner bg-white"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-700 hover:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed text-white px-10 md:px-16 py-5 md:py-8 rounded-[1.5rem] md:rounded-[2.5rem] text-xl md:text-3xl font-black shadow-2xl transition transform active:scale-95 uppercase tracking-tighter"
            >
              {loading ? "SEARCHING..." : "SEARCH"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-2xl font-bold border-2 border-red-200 inline-block">
             {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-12 md:mt-24 bg-white rounded-[2rem] md:rounded-[4rem] shadow-2xl p-6 md:p-20 overflow-hidden border-2 border-purple-50 relative">
            <div className="absolute top-0 left-0 w-full h-4 bg-purple-600"></div>
            
            {result.status === "Not Found" ? (
              <div className="text-center py-10 md:py-20">
                <FaTimesCircle className="text-7xl md:text-[150px] text-red-600 mx-auto mb-8" />
                <h2 className="text-3xl md:text-6xl font-black text-red-700 uppercase tracking-tighter">APPLICATION<br />NOT FOUND</h2>
                <p className="text-lg md:text-2xl text-gray-500 mt-8 px-6 font-medium leading-relaxed">
                  Please double-check your Reference ID. Make sure you entered it correctly exactly as shown on your receipt.
                </p>
              </div>
            ) : (
              <>
                {/* Status Header */}
                <div className="text-center mb-10 md:mb-16">
                  <p className="text-xs md:text-lg font-black text-purple-700 uppercase tracking-widest mb-2">Current Status</p>
                  <h2 className={`text-5xl md:text-9xl font-black tracking-tighter leading-none ${result.status === 'Pending' ? 'text-orange-600' : 'text-green-700'}`}>
                    {result.status === "Pending" ? "PENDING" : "APPROVED"}
                  </h2>
                  <div className="inline-block mt-6 bg-purple-100 px-6 py-2 rounded-full border-2 border-purple-200">
                    <p className="text-sm md:text-2xl font-black text-purple-800 tracking-tight">ID: {result.reference_id}</p>
                  </div>
                </div>

                {/* Status Icon */}
                <div className="flex justify-center mb-10 md:mb-16">
                  {result.status === "Pending" ? (
                    <FaClock className="text-7xl md:text-[150px] text-orange-500 animate-pulse" />
                  ) : (
                    <FaCheckCircle className="text-7xl md:text-[150px] text-green-600" />
                  )}
                </div>

                {/* Details Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border-2 border-purple-100 text-left shadow-inner">
                  <h3 className="text-lg md:text-2xl font-black text-purple-800 mb-8 md:mb-12 uppercase tracking-widest text-center border-b-2 border-purple-50 pb-6">
                    Application Info
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-6 md:space-y-10">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-700 flex-shrink-0">
                          <FaInfoCircle className="text-xl md:text-3xl" />
                        </div>
                        <div>
                           <p className="font-black text-purple-400 text-[10px] md:text-sm uppercase tracking-widest mb-1">Full Name</p>
                           <p className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">{result.first_name}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-700 flex-shrink-0">
                          <FaHome className="text-xl md:text-3xl" />
                        </div>
                        <div>
                           <p className="font-black text-purple-400 text-[10px] md:text-sm uppercase tracking-widest mb-1">Address</p>
                           <p className="text-lg md:text-2xl font-bold text-gray-700 leading-tight">{result.details?.address || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 md:space-y-10">
                      <div>
                        <p className="font-black text-purple-400 text-[10px] md:text-sm uppercase tracking-widest mb-3">Service Requested</p>
                        <p className="bg-purple-700 px-6 py-3 rounded-2xl text-white font-black text-lg md:text-2xl shadow-lg inline-block">
                          {result.service_type}
                        </p>
                      </div>

                      <div>
                        <p className="font-black text-purple-400 text-[10px] md:text-sm uppercase tracking-widest mb-2">Date Submitted</p>
                        <p className="text-2xl md:text-4xl font-black text-purple-900">
                          {new Date(result.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Message */}
                <div className="mt-12 md:mt-20 text-center px-4">
                  {result.status === "Pending" ? (
                    <div className="bg-orange-50 border-2 border-orange-200 p-6 md:p-10 rounded-3xl">
                      <p className="text-xl md:text-3xl text-orange-700 font-bold leading-tight">
                        Your application is currently under review by the Barangay Secretary. Please wait for the status to change to APPROVED.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-50 border-2 border-green-200 p-6 md:p-10 rounded-3xl">
                      <p className="text-2xl md:text-4xl text-green-700 font-black leading-tight mb-4 uppercase tracking-tighter">
                        READY FOR PICKUP!
                      </p>
                      <p className="text-lg md:text-2xl text-gray-600 font-medium">
                        Please visit the <span className="font-bold text-green-800 uppercase">Barangay Hall</span> with your Reference ID to claim your document.
                      </p>
                    </div>
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