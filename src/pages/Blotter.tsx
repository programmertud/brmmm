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
    <div className="max-w-5xl mx-auto mt-6 bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-center text-red-700">
        BLOTTER MANAGEMENT
      </h1>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 mb-10 bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            name="complainant"
            value={form.complainant}
            onChange={handleChange}
            placeholder="Complainant Name *"
            className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
          <input
            type="text"
            name="offender"
            value={form.offender}
            onChange={handleChange}
            placeholder="Offender Name *"
            className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <select
          name="caseType"
          value={form.caseType}
          onChange={handleChange}
          className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500"
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

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Full description of the incident *"
          rows={4}
          className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
          required
        />

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="resolved"
            checked={form.resolved || false}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-red-600 rounded"
          />
          <label htmlFor="resolved" className="text-gray-700 font-medium">
            Mark as Resolved
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-medium transition"
          >
            {editingIndex !== null ? "Update" : "Add"} Blotter Entry
          </button>
          {editingIndex !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Blotter Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-red-100 text-red-800">
            <tr>
              <th className="border px-4 py-3 text-left">Complainant</th>
              <th className="border px-4 py-3 text-left">Offender</th>
              <th className="border px-4 py-3">Case Type</th>
              <th className="border px-4 py-3">Description</th>
              <th className="border px-4 py-3 text-center">Status</th>
              <th className="border px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blotters.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  No blotter entries recorded yet.
                </td>
              </tr>
            ) : (
              blotters.map((b, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-3 font-medium">{b.complainant}</td>
                  <td className="border px-4 py-3">{b.offender}</td>
                  <td className="border px-4 py-3">
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                      {b.caseType}
                    </span>
                  </td>
                  <td className="border px-4 py-3 text-gray-700 max-w-xs truncate">
                    {b.description}
                  </td>
                  <td className="border px-4 py-3 text-center">
                    {b.resolved ? (
                      <span className="text-green-600 font-bold">Resolved</span>
                    ) : (
                      <span className="text-orange-600">Pending</span>
                    )}
                  </td>
                  <td className="border px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdit(idx)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}