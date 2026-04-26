// src/pages/AdminAnnouncements.tsx
import React, { useEffect, useState } from "react";
import { FaBullhorn } from "react-icons/fa";
import api from "../services/api";

interface AnnouncementItem {
  title: string;
  date: string;
  desc: string;
}

export default function AdminAnnouncements() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [body, setBody] = useState("");

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!title.trim() || !date.trim() || !body.trim()) {
      setCreateError("Please fill in all fields.");
      return;
    }

    setCreating(true);
    try {
      await api.post("/announcements", {
        title,
        body,
        date,
      });

      const reload = await api.get("/announcements");
      setItems(reload.data);

      setTitle("");
      setDate("");
      setBody("");
    } catch (err) {
      console.error(err);
      setCreateError("Failed to create announcement.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Barangay Announcements</h1>
          <p className="text-gray-600">View announcements shown on the public portal.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        <form onSubmit={handleCreate} className="grid md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-3 flex items-center gap-4">
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
            >
              {creating ? "Posting..." : "Post Announcement"}
            </button>
            {createError && <p className="text-sm text-red-600">{createError}</p>}
          </div>
        </form>

        {loading ? (
          <p className="text-gray-600">Loading announcements...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">No announcements found.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((a, idx) => (
              <li key={idx} className="border rounded-xl p-4 flex gap-4 items-start hover:bg-gray-50">
                <div className="mt-1 text-blue-600">
                  <FaBullhorn />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{a.date}</p>
                  <h2 className="font-bold text-lg text-gray-800">{a.title}</h2>
                  <p className="text-gray-700 mt-1 text-sm">{a.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
