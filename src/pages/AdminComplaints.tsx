// src/pages/AdminComplaints.tsx
import React, { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import api from "../services/api";

interface ComplaintItem {
  id: number;
  complainant: string; // Map to name
  subject: string;
  description: string; // Map to message
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

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await api.patch(`/complaints/${id}`, { status: newStatus });
      // Refresh list
      const response = await api.get("/complaints");
      setItems(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await api.delete(`/complaints/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete complaint");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
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
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full text-sm min-w-[1000px] hidden md:table">
              <thead className="bg-red-700 text-white">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Details</th>
                  <th className="p-3 text-left">Subject</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-medium">{c.complainant}</td>
                    <td className="p-3 italic text-gray-500 max-w-xs truncate">{c.description}</td>
                    <td className="p-3">{c.subject}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-xs ${
                        c.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                        c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        <FaExclamationTriangle /> {c.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUpdateStatus(c.id, "In Progress")}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition shadow-sm"
                        >
                          ACTION
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(c.id, "Resolved")}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition shadow-sm"
                        >
                          RESOLVE
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition shadow-sm"
                        >
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {items.map((c) => (
                <div key={c.id} className="p-5 space-y-4 bg-white hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</p>
                      <h3 className="font-bold text-gray-900">{c.complainant}</h3>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-[10px] uppercase ${
                      c.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                      c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Subject: {c.subject}</p>
                    <p className="text-sm text-gray-600 line-clamp-3 italic leading-relaxed">
                      "{c.description}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button 
                      onClick={() => handleUpdateStatus(c.id, "In Progress")}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold transition shadow-sm"
                    >
                      ACTION
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(c.id, "Resolved")}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs font-bold transition shadow-sm"
                    >
                      RESOLVE
                    </button>
                    <button 
                      onClick={() => handleDelete(c.id)}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-200 transition"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
