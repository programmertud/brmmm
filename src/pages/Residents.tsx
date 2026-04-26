// src/pages/ResidentsPage.tsx
import React, { useState, useEffect } from "react";
import { FaCamera, FaUserCircle } from "react-icons/fa";
import {
  getResidents,
  saveResident,
  updateResident,
  deleteResident,
  Resident,
} from "../services/storage";

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [form, setForm] = useState<Resident>({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    address: "",
    contact: "",
    photo: "", // ← New field
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setResidents(getResidents());
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        setForm({ ...form, photo: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const validateForm = (): boolean => {
    const required = [
      form.firstName,
      form.lastName,
      form.age,
      form.gender,
      form.address,
      form.contact,
    ];
    return required.every((field) => field.trim() !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (editingIndex !== null) {
      updateResident(editingIndex, form);
    } else {
      saveResident(form);
    }

    setResidents(getResidents());
    resetForm();
    setError("");
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
      address: "",
      contact: "",
      photo: "",
    });
    setPhotoPreview(null);
    setEditingIndex(null);
  };

  const handleEdit = (index: number) => {
    const resident = residents[index];
    setForm(resident);
    setPhotoPreview(resident.photo || null);
    setEditingIndex(index);
    setError("");
  };

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this resident?")) {
      deleteResident(index);
      setResidents(getResidents());
    }
  };

  const handleCancel = () => {
    resetForm();
    setError("");
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 bg-white p-8 rounded-2xl shadow-2xl">
      <h1 className="text-4xl font-bold mb-10 text-center text-green-800">
        RESIDENTS MANAGEMENT
      </h1>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-gray-50 p-8 rounded-2xl shadow-inner mb-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* PHOTO UPLOAD */}
          <div className="flex justify-center">
            <div className="relative group">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Resident"
                  className="w-48 h-48 rounded-full object-cover border-8 border-green-700 shadow-2xl"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-gray-200 border-8 border-dashed border-green-700 flex items-center justify-center">
                  <FaUserCircle className="text-9xl text-gray-400" />
                </div>
              )}

              <label
                htmlFor="photo-upload"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
              >
                <FaCamera className="text-5xl text-white" />
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>

          <p className="text-center text-gray-600 font-medium -mt-4">
            Click to {photoPreview ? "change" : "upload"} photo
          </p>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name *"
              className="px-6 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 focus:border-green-500 transition text-lg"
              required
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name *"
              className="px-6 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 focus:border-green-500 transition text-lg"
              required
            />
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Age *"
              min="1"
              max="120"
              className="px-6 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 focus:border-green-500 transition text-lg"
              required
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="px-6 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 focus:border-green-500 transition text-lg"
              required
            >
              <option value="">Select Gender *</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Full Address *"
              className="px-6 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 focus:border-green-500 transition text-lg md:col-span-2"
              required
            />
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Contact Number * (e.g. 09123456789)"
              className="px-6 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 focus:border-green-500 transition text-lg md:col-span-2"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-5 rounded-xl font-bold text-xl shadow-xl transition transform hover:scale-105"
            >
              {editingIndex !== null ? "Update" : "Add"} Resident
            </button>
            {editingIndex !== null && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Residents Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-6 py-5 text-left">Photo</th>
              <th className="px-6 py-5 text-left">Full Name</th>
              <th className="px-6 py-5 text-center">Age</th>
              <th className="px-6 py-5 text-center">Gender</th>
              <th className="px-6 py-5">Address</th>
              <th className="px-6 py-5">Contact</th>
              <th className="px-6 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {residents.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-500 text-lg">
                  No residents added yet. Start adding now!
                </td>
              </tr>
            ) : (
              residents.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    {r.photo ? (
                      <img
                        src={r.photo}
                        alt={r.firstName}
                        className="w-16 h-16 rounded-full object-cover border-4 border-green-600 shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 border-4 border-dashed border-gray-400 flex items-center justify-center">
                        <FaUserCircle className="text-4xl text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    {r.firstName} {r.lastName}
                  </td>
                  <td className="px-6 py-4 text-center">{r.age}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      r.gender === "Male" ? "bg-blue-100 text-blue-800" :
                      r.gender === "Female" ? "bg-pink-100 text-pink-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {r.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4">{r.address}</td>
                  <td className="px-6 py-4">{r.contact}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEdit(idx)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg mr-2 font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition"
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