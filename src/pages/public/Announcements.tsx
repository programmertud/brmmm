// src/pages/public/Announcements.tsx
import React, { useEffect, useState } from "react";
import { FaBullhorn, FaCalendarAlt } from "react-icons/fa";
import api from "../../services/api";

interface AnnouncementItem {
  title: string;
  date: string;
  desc: string;
}

import Navbar from "../../components/Navbar";

export default function Announcements() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/announcements");
        setItems(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load announcements.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-sans overflow-x-hidden">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        
        {/* Premium Header */}
        <div className="text-center mb-10 md:mb-20 relative">
          <div className="absolute inset-0 flex items-center justify-center -top-10 md:-top-20 opacity-5 md:opacity-10 pointer-events-none">
            <FaBullhorn className="text-[150px] md:text-[250px] text-blue-600 rotate-12" />
          </div>
          <FaBullhorn className="text-6xl md:text-9xl text-blue-600 mx-auto mb-6 md:mb-8 drop-shadow-2xl animate-pulse" />
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-blue-900 tracking-tight mb-4 uppercase">
            Latest <span className="text-blue-600">Announcements</span>
          </h1>
          <div className="h-1.5 md:h-2 w-20 md:w-32 bg-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-base md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto px-4 leading-relaxed">
            Stay updated with the latest news, events, and important schedules from Barangay Rizal.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading announcements...</p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {items.map((item, i) => (
              <div 
                key={i} 
                className="group bg-white rounded-[2rem] md:rounded-[40px] shadow-xl md:shadow-2xl p-6 md:p-10 border-2 border-transparent hover:border-blue-500 transition-all duration-500 flex flex-col"
              >
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 bg-blue-50 w-fit px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl">
                  <FaCalendarAlt className="text-xl md:text-2xl text-blue-600" />
                  <span className="text-xs md:text-lg font-black text-blue-800 uppercase tracking-widest">
                    {item.date}
                  </span>
                </div>
                
                <h3 className="text-xl md:text-3xl font-black text-gray-900 mb-4 md:mb-6 leading-tight group-hover:text-blue-700 transition">
                  {item.title}
                </h3>
                
                <div className="h-1 md:h-1.5 w-12 md:w-16 bg-blue-200 mb-6 md:mb-8 rounded-full group-hover:w-full transition-all duration-500"></div>
                
                <p className="text-gray-600 text-sm md:text-xl leading-relaxed flex-1 italic line-clamp-4 md:line-clamp-none">
                  "{item.desc}"
                </p>

                <div className="mt-8 md:mt-10 pt-6 border-t border-gray-100 flex justify-between items-center text-blue-600 font-bold text-sm md:text-base">
                  <span>Full Details</span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center transform group-hover:scale-110 transition">
                    →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}