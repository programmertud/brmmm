// src/pages/AdminComplaints.tsx
import React, { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import api from "../services/api";

interface ComplaintItem {
  id: number;
  name: string;
  contact: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminComplaints() {
  const [items, setItems] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/complaints");
        setItems(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load complaints.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-red-800">Resident Complaints</h1>
          <p className="text-gray-600">View complaints submitted from the public portal.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-600">Loading complaints...</p>
        ) : error ? (
          <p className="p-6 text-red-600">{error}</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-gray-500">No complaints found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-red-700 text-white">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 whitespace-nowrap">{c.created_at}</td>
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.contact}</td>
                  <td className="p-3">{c.subject}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs">
                      <FaExclamationTriangle /> {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
