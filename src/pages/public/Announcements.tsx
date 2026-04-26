// src/pages/public/Announcements.tsx
import React, { useEffect, useState } from "react";
import { FaBullhorn, FaCalendarAlt } from "react-icons/fa";
import api from "../../services/api";

interface AnnouncementItem {
  title: string;
  date: string;
  desc: string;
}

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <FaBullhorn className="text-8xl text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-blue-800">Latest Announcements</h1>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading announcements...</p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition transform hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-4">
                  <FaCalendarAlt className="text-4xl text-blue-600" />
                  <span className="text-xl font-bold text-blue-700">{item.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}