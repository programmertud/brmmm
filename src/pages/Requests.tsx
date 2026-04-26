// src/pages/Requests.tsx
import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaPrint, FaEye, FaTrashAlt, FaExclamationTriangle } from "react-icons/fa";
import api from "../services/api";

export default function Requests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null); // ID to delete

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/applications");
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to load applications", error);
      }
    };

    load();
  }, []);

  const updateStatus = async (id: string, newStatus: "Approved" | "Rejected") => {
    try {
      await api.patch(`/applications/${encodeURIComponent(id)}/status`, {
        status: newStatus,
      });

      const updated = requests.map((r) =>
        r.id === id ? { ...r, status: newStatus } : r
      );
      setRequests(updated);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      await api.delete(`/applications/${encodeURIComponent(id)}`);

      const updated = requests.filter((r) => r.id !== id);
      setRequests(updated);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete application", error);
    }
  };

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-green-800 mb-2">Resident Requests</h1>
        <p className="text-gray-600">Review, approve, or delete certificate applications</p>
      </div>

      {/* Filter Buttons with Count */}
      <div className="flex gap-4 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-6 py-3 rounded-xl font-bold transition ${filter === "all" ? "bg-green-700 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
          All ({requests.length})
        </button>
        <button onClick={() => setFilter("Pending")} className={`px-6 py-3 rounded-xl font-bold transition ${filter === "Pending" ? "bg-orange-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
          Pending ({requests.filter(r => r.status === "Pending").length})
        </button>
        <button onClick={() => setFilter("Approved")} className={`px-6 py-3 rounded-xl font-bold transition ${filter === "Approved" ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
          Approved ({requests.filter(r => r.status === "Approved").length})
        </button>
        <button onClick={() => setFilter("Rejected")} className={`px-6 py-3 rounded-xl font-bold transition ${filter === "Rejected" ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
          Rejected ({requests.filter(r => r.status === "Rejected").length})
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-green-700 to-green-800 text-white">
            <tr>
              <th className="p-4 text-left">Ref ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Certificate</th>
              <th className="p-4 text-left">Purpose</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-500 text-xl">
                  No requests found
                </td>
              </tr>
            ) : (
              filtered.map((req) => (
                <tr key={req.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-green-700 text-lg">{req.id}</td>
                  <td className="p-4 font-medium">{req.fullName}</td>
                  <td className="p-4">{req.certificateType}</td>
                  <td className="p-4 max-w-md">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-gray-700" title={req.purpose}>
                        {req.purpose || "Not specified"}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {req.date}<br /><span className="text-xs">{req.time}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-4 py-2 rounded-full font-bold text-sm
                      ${req.status === "Approved" ? "bg-green-100 text-green-800" :
                        req.status === "Rejected" ? "bg-red-100 text-red-800" :
                        "bg-orange-100 text-orange-800"}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex gap-3 justify-center items-center">
                      {/* Pending: Approve / Reject */}
                      {req.status === "Pending" && (
                        <>
                          <button onClick={() => updateStatus(req.id, "Approved")} className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl shadow-md transition transform hover:scale-110" title="Approve">
                            <FaCheck />
                          </button>
                          <button onClick={() => updateStatus(req.id, "Rejected")} className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl shadow-md transition transform hover:scale-110" title="Reject">
                            <FaTimes />
                          </button>
                        </>
                      )}

                      {/* View Details */}
                      <button onClick={() => setSelectedRequest(req)} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-md transition transform hover:scale-110" title="View Details">
                        <FaEye />
                      </button>

                      {/* Print for Approved */}
                      {req.status === "Approved" && (
                        <button className="text-green-600 hover:text-green-800 text-3xl transition transform hover:scale-110" title="Print Certificate">
                          <FaPrint />
                        </button>
                      )}

                      {/* Delete for Approved & Rejected */}
                      {(req.status === "Approved" || req.status === "Rejected") && (
                        <button
                          onClick={() => setDeleteConfirm(req.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl shadow-md transition transform hover:scale-110"
                          title="Delete Request"
                        >
                          <FaTrashAlt />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
            <FaExclamationTriangle className="text-8xl text-red-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-red-700 mb-4">Delete Request?</h2>
            <p className="text-lg text-gray-700 mb-8">
              This action <strong>cannot be undone</strong>.<br />
              The resident will no longer be able to track this request.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => deleteRequest(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold text-xl transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-10 py-4 rounded-xl font-bold text-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-10 max-h-screen overflow-y-auto">
            <h2 className="text-4xl font-bold text-green-800 mb-8 text-center">Request Details</h2>
            <div className="space-y-6 text-lg">
              {/* Same as before */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="font-bold text-gray-700">Reference ID</p>
                  <p className="text-2xl font-black text-green-700">{selectedRequest.id}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">Status</p>
                  <p className={`text-2xl font-bold ${selectedRequest.status === "Approved" ? "text-green-600" : "text-red-600"}`}>
                    {selectedRequest.status}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl"><p className="font-bold text-gray-700 mb-2">Full Name</p><p className="text-xl">{selectedRequest.fullName}</p></div>
              <div className="bg-gray-50 p-6 rounded-2xl"><p className="font-bold text-gray-700 mb-2">Address</p><p className="text-xl">{selectedRequest.address}</p></div>
              <div className="bg-gray-50 p-6 rounded-2xl"><p className="font-bold text-gray-700 mb-2">Contact</p><p className="text-xl">{selectedRequest.contact}</p></div>
              <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200">
                <p className="font-bold text-blue-800 mb-3 text-xl">Purpose of Request</p>
                <p className="text-lg italic text-gray-800 leading-relaxed">"{selectedRequest.purpose}"</p>
              </div>
              <div className="text-center text-gray-600">
                <p>Submitted on {selectedRequest.date} at {selectedRequest.time}</p>
              </div>
            </div>
            <button onClick={() => setSelectedRequest(null)} className="mt-10 w-full bg-gray-700 hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-xl transition">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}