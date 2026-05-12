// src/pages/Blotter.tsx
import React, { useState, useEffect } from "react";
import {
  getBlotters,
  saveBlotter,
  updateBlotter,
  deleteBlotter,
  Blotter as BlotterType,
} from "../services/storage";

export default function Blotter() {
  const [blotters, setBlotters] = useState<BlotterType[]>([]);
  const [form, setForm] = useState<Omit<BlotterType, "resolved"> & { resolved?: boolean }>({
    complainant: "",
    offender: "",
    caseType: "",
    description: "",
    resolved: false,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setBlotters(getBlotters());
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError(""); // Clear error when typing
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, resolved: e.target.checked });
  };

  const validateForm = (): boolean => {
    if (!form.complainant.trim()) return false;
    if (!form.offender.trim()) return false;
    if (!form.caseType) return false;
    if (!form.description.trim()) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fill in all required fields.");
      return;
    }

    const blotterData: BlotterType = {
      complainant: form.complainant.trim(),
      offender: form.offender.trim(),
      caseType: form.caseType,
      description: form.description.trim(),
      resolved: form.resolved ?? false,
    };

    if (editingIndex !== null) {
      updateBlotter(editingIndex, blotterData);
    } else {
      saveBlotter(blotterData);
    }

    setBlotters(getBlotters());
    resetForm();
  };

  const resetForm = () => {
    setForm({
      complainant: "",
      offender: "",
      caseType: "",
      description: "",
      resolved: false,
    });
    setEditingIndex(null);
    setError("");
  };

  const handleEdit = (index: number) => {
    const blotter = blotters[index];
    setForm(blotter);
    setEditingIndex(index);
    setError("");
  };

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this blotter entry?")) {
      deleteBlotter(index);
      setBlotters(getBlotters());
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-0 md:mt-6 bg-white p-4 md:p-8 rounded-none md:rounded-2xl shadow-2xl min-h-screen md:min-h-0">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-10 text-center text-red-700 uppercase tracking-tight">
        BLOTTER MANAGEMENT
      </h1>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-red-50 p-4 md:p-8 rounded-2xl shadow-inner mb-10 border border-red-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-red-800 uppercase ml-1">Complainant Name *</label>
              <input
                type="text"
                name="complainant"
                value={form.complainant}
                onChange={handleChange}
                placeholder="Ex. Juan Dela Cruz"
                className="w-full border-2 border-red-100 px-4 py-3 md:px-5 md:py-4 rounded-xl focus:ring-4 focus:ring-red-500 focus:border-red-500 transition text-base md:text-lg"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-red-800 uppercase ml-1">Offender Name *</label>
              <input
                type="text"
                name="offender"
                value={form.offender}
                onChange={handleChange}
                placeholder="Ex. Pedro Penduko"
                className="w-full border-2 border-red-100 px-4 py-3 md:px-5 md:py-4 rounded-xl focus:ring-4 focus:ring-red-500 focus:border-red-500 transition text-base md:text-lg"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-red-800 uppercase ml-1">Case Type *</label>
            <select
              name="caseType"
              value={form.caseType}
              onChange={handleChange}
              className="w-full border-2 border-red-100 px-4 py-3 md:px-5 md:py-4 rounded-xl focus:ring-4 focus:ring-red-500 focus:border-red-500 transition text-base md:text-lg bg-white"
              required
            >
              <option value="">Select Case Type *</option>
              <option value="Theft">Theft</option>
              <option value="Physical Assault">Physical Assault</option>
              <option value="Verbal Dispute">Verbal Dispute</option>
              <option value="Noise Complaint">Noise Complaint</option>
              <option value="Domestic Issue">Domestic Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-red-800 uppercase ml-1">Case Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the incident in detail..."
              rows={4}
              className="w-full border-2 border-red-100 px-4 py-3 md:px-5 md:py-4 rounded-xl focus:ring-4 focus:ring-red-500 focus:border-red-500 transition text-base md:text-lg resize-none"
              required
            />
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border-2 border-red-100">
            <input
              type="checkbox"
              id="resolved"
              checked={form.resolved || false}
              onChange={handleCheckboxChange}
              className="w-6 h-6 text-red-600 rounded focus:ring-red-500 transition cursor-pointer"
            />
            <label htmlFor="resolved" className="text-gray-800 font-bold cursor-pointer select-none">
              Case Resolved
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 md:py-5 rounded-xl font-bold text-lg md:text-xl shadow-xl transition transform active:scale-95"
            >
              {editingIndex !== null ? "Update Case" : "File Blotter Entry"}
            </button>
            {editingIndex !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-4 md:py-5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Blotter Records */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-sm">
            <thead className="bg-red-700 text-white text-left">
              <tr>
                <th className="px-6 py-5">Complainant</th>
                <th className="px-6 py-5">Offender</th>
                <th className="px-6 py-5">Case Type</th>
                <th className="px-6 py-5">Description</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blotters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-500 text-lg">
                    No blotter records found.
                  </td>
                </tr>
              ) : (
                blotters.map((b, idx) => (
                  <tr key={idx} className="hover:bg-red-50 transition border-b border-red-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{b.complainant}</td>
                    <td className="px-6 py-4 text-gray-700">{b.offender}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-[10px] font-black uppercase">
                        {b.caseType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 italic truncate max-w-xs">
                      {b.description}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-black text-xs uppercase px-3 py-1 rounded-full ${b.resolved ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                        {b.resolved ? "Resolved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <button onClick={() => handleEdit(idx)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg mr-2 font-bold transition">Edit</button>
                      <button onClick={() => handleDelete(idx)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {blotters.length === 0 ? (
            <p className="text-center py-10 text-gray-500 italic">No records found.</p>
          ) : (
            blotters.map((b, idx) => (
              <div key={idx} className="p-5 space-y-4 bg-white hover:bg-red-50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-red-900 text-lg">{b.complainant}</h3>
                    <p className="text-xs text-gray-500">vs. <span className="font-bold text-gray-700">{b.offender}</span></p>
                  </div>
                  <span className={`font-black text-[10px] uppercase px-3 py-1 rounded-full ${b.resolved ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {b.resolved ? "Resolved" : "Pending"}
                  </span>
                </div>

                <div className="bg-red-100/50 p-3 rounded-xl border border-red-100">
                  <p className="text-[10px] font-black text-red-700 uppercase mb-1">{b.caseType}</p>
                  <p className="text-sm text-gray-700 italic leading-relaxed line-clamp-3">"{b.description}"</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleEdit(idx)} className="flex-1 bg-yellow-500 text-white py-3 rounded-xl text-xs font-bold shadow-md">EDIT</button>
                  <button onClick={() => handleDelete(idx)} className="flex-1 bg-red-600 text-white py-3 rounded-xl text-xs font-bold shadow-md">DELETE</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}