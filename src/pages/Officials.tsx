// src/pages/Officials.tsx
import React, { useState } from "react";

// Import official photos
import captain from "../assets/officials/captain.jpg";
import secretary from "../assets/officials/secretary.jpg";
import treasurer from "../assets/officials/treasurer.jpg";
import sbm1 from "../assets/officials/sbm1.jpg";
import sbm2 from "../assets/officials/sbm2.jpg";
import sbm3 from "../assets/officials/sbm3.jpg";
import sbm4 from "../assets/officials/sbm4.jpg";
import sbm5 from "../assets/officials/sbm5.jpg";
import sbm6 from "../assets/officials/sbm6.jpg";
import sbm7 from "../assets/officials/sbm7.jpg";
import sk from "../assets/officials/sk.jpg";
import placeholder from "../assets/officials/captain.jpg";

import Navbar from "../components/Navbar";

export default function Officials() {
  const [selectedOfficial, setSelectedOfficial] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const officials = [
    { id: 1, name: "Hon. Romeo R. Sanchez", position: "Punong Barangay", term: "2023-2028", photo: captain, contact: "0927-XXX-XXXX" },
    { id: 2, name: "Mrs. Arnida D.Rendon", position: "Barangay Secretary", term: "Appointed", photo: secretary, contact: "0927-XXX-XXXX" },
    { id: 3, name: "Mr. Roldan C. Ariar", position: "Barangay Treasurer", term: "Appointed", photo: treasurer, contact: "0927-XXX-XXXX" },
    { id: 4, name: "Hon. Nenita R. Tillo", position: "Sangguniang Barangay Member", term: "2023-2028", photo: sbm1, contact: "0927-XXX-XXXX" },
    { id: 5, name: "Hon. Severo A. Del Rosario", position: "Sangguniang Barangay Member", term: "2023-2028", photo: sbm2, contact: "0927-XXX-XXXX" },
    { id: 6, name: "Hon. Brent E. Berdin", position: "Sangguniang Barangay Member", term: "2023-2028", photo: sbm3, contact: "0927-XXX-XXXX" },
    { id: 7, name: "Hon. Mejane C. Abian", position: "Sangguniang Barangay Member", term: "2023-2028", photo: sbm4, contact: "0927-XXX-XXXX" },
    { id: 8, name: "Hon. Tyrone Adrian A. Cruje", position: "Sangguniang Barangay Member", term: "2023-2028", photo: sbm5, contact: "0927-XXX-XXXX" },
    { id: 9, name: "Hon. Maria Denia R. Egot", position: "Sangguniang Barangay Member", term: "2023-2028", photo: sbm6, contact: "0927-XXX-XXXX" },
    { id: 10, name: "Hon. Wilfreda B. Loayon", position: "Sangguniang Barangay Member", term: "2023-2028", photo: sbm7, contact: "0927-XXX-XXXX" },
    { id: 11, name: "Hon. Marry Ann T. Sala", position: "SK Chairperson", term: "2023-2028", photo: sk, contact: "0927-XXX-XXXX" },
  ];

  const openContactForm = (official: any) => {
    setSelectedOfficial(official);
    setFormData({ name: "", email: "", phone: "", message: "" });
    setShowSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Message sent to:", selectedOfficial.name, formData);
    setShowSuccess(true);
    setTimeout(() => {
      setSelectedOfficial(null);
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">
      <Navbar />
      <div className="space-y-8 md:space-y-10 p-4 md:p-6">
        {/* Header */}
        <div className="text-center pt-6 md:pt-10">
          <h1 className="text-3xl md:text-5xl font-bold text-green-800 mb-4 uppercase tracking-tight">Barangay Officials</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Current Elected and Appointed Officials of <strong>Barangay Rizal</strong>
          </p>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Officials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10 mt-8 md:mt-12">
          {officials.map((official) => (
            <div
              key={official.id}
              className="group relative bg-white rounded-2xl shadow-xl overflow-hidden transform md:hover:scale-105 transition-all duration-300 border border-green-100"
            >
              <div className="relative h-64 md:h-80 bg-gradient-to-b from-green-50 to-green-100">
                <img
                  src={official.photo}
                  alt={official.name}
                  onError={(e) => (e.currentTarget.src = placeholder)}
                  className="w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-yellow-500 text-green-900 px-4 py-2 rounded-full font-bold text-xs md:text-sm shadow-lg">
                  {official.position === "Punong Barangay" ? "Captain" : "Official"}
                </div>
              </div>

              <div className="p-5 md:p-6 text-center bg-gradient-to-t from-green-900 to-green-800 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-1 truncate px-2">{official.name}</h3>
                <p className="text-yellow-300 font-semibold text-sm md:text-lg">{official.position}</p>
                <p className="text-green-200 text-xs md:text-sm mt-2 opacity-80">Term: {official.term}</p>

                {/* Contact Button */}
                <button
                  onClick={() => openContactForm(official)}
                  className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-3 rounded-xl transition shadow-lg active:scale-95"
                >
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Modal */}
        {selectedOfficial && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="bg-gradient-to-r from-green-700 to-green-900 text-white p-6 md:p-8 rounded-t-2xl">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
                  <img
                    src={selectedOfficial.photo}
                    alt={selectedOfficial.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-yellow-400 shadow-xl object-cover"
                  />
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">{selectedOfficial.name}</h2>
                    <p className="text-yellow-300 text-lg md:text-xl">{selectedOfficial.position}</p>
                    <p className="text-green-200 text-sm md:text-base opacity-90">Term: {selectedOfficial.term}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {showSuccess ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 text-green-600">✓</div>
                    <p className="text-2xl text-green-700 font-bold">Your message has been sent!</p>
                    <p className="text-gray-600 mt-4">The official will get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Send a Message</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        type="text"
                        placeholder="Your Full Name *"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:outline-none transition"
                      />
                      <input
                        type="email"
                        placeholder="Your Email *"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:outline-none transition"
                      />
                    </div>

                    <input
                      type="tel"
                      placeholder="Your Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:outline-none transition"
                    />

                    <textarea
                      placeholder="Your Message *"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:outline-none transition resize-none"
                    />

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl transition shadow-lg"
                      >
                        Send Message
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedOfficial(null)}
                        className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-20 pb-10 text-gray-600">
          <p className="text-lg">
            Serving with dedication and integrity for the people of Barangay Rizal
          </p>
          <p className="mt-2 text-sm">© 2025 Barangay Rizal Administration</p>
        </div>
      </div>
    </div>
  );
}