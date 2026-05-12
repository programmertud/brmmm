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
    <div className="max-w-7xl mx-auto mt-0 md:mt-6 bg-white p-4 md:p-8 rounded-none md:rounded-2xl shadow-2xl min-h-screen md:min-h-0">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-10 text-center text-green-800 uppercase tracking-tight">
        Residents Management
      </h1>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Form Section */}
      <div className="bg-gray-50 p-4 md:p-8 rounded-2xl shadow-inner mb-10">
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          {/* PHOTO UPLOAD */}
          <div className="flex justify-center">
            <div className="relative group">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Resident"
                  className="w-28 h-28 md:w-48 md:h-48 rounded-full object-cover border-4 md:border-8 border-green-700 shadow-2xl"
                />
              ) : (
                <div className="w-28 h-28 md:w-48 md:h-48 rounded-full bg-gray-200 border-4 md:border-8 border-dashed border-green-700 flex items-center justify-center">
                  <FaUserCircle className="text-6xl md:text-9xl text-gray-400" />
                </div>
              )}

              <label
                htmlFor="photo-upload"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full opacity-0 md:group-hover:opacity-100 transition cursor-pointer"
              >
                <FaCamera className="text-3xl md:text-5xl text-white" />
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

          <p className="text-center text-gray-600 font-medium -mt-4 text-sm md:text-base">
            Click to {photoPreview ? "change" : "upload"} photo
          </p>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name *"
              className="px-4 py-3 md:px-6 md:py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 transition text-base md:text-lg"
              required
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name *"
              className="px-4 py-3 md:px-6 md:py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 transition text-base md:text-lg"
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
              className="px-4 py-3 md:px-6 md:py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 transition text-base md:text-lg"
              required
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="px-4 py-3 md:px-6 md:py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 transition text-base md:text-lg"
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
              className="px-4 py-3 md:px-6 md:py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 transition text-base md:text-lg md:col-span-2"
              required
            />
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Contact Number *"
              className="px-4 py-3 md:px-6 md:py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 transition text-base md:text-lg md:col-span-2"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 md:py-5 rounded-xl font-bold text-lg md:text-xl shadow-xl transition transform active:scale-95"
            >
              {editingIndex !== null ? "Update" : "Add"} Resident
            </button>
            {editingIndex !== null && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-4 md:py-5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Residents List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
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
                    No residents added yet.
                  </td>
                </tr>
              ) : (
                residents.map((r, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      {r.photo ? (
                        <img src={r.photo} alt={r.firstName} className="w-12 h-12 rounded-full object-cover border-2 border-green-600" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <FaUserCircle className="text-2xl text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">{r.firstName} {r.lastName}</td>
                    <td className="px-6 py-4 text-center">{r.age}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        r.gender === "Male" ? "bg-blue-100 text-blue-800" :
                        r.gender === "Female" ? "bg-pink-100 text-pink-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {r.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">{r.address}</td>
                    <td className="px-6 py-4 text-xs">{r.contact}</td>
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
          {residents.length === 0 ? (
            <p className="text-center py-10 text-gray-500">No residents added yet.</p>
          ) : (
            residents.map((r, idx) => (
              <div key={idx} className="p-4 flex gap-4 items-center bg-white hover:bg-gray-50 transition">
                <div className="flex-shrink-0">
                  {r.photo ? (
                    <img src={r.photo} alt={r.firstName} className="w-20 h-20 rounded-2xl object-cover border-2 border-green-600 shadow-lg" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <FaUserCircle className="text-5xl text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate text-lg">{r.firstName} {r.lastName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">{r.age} yrs</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      r.gender === "Male" ? "bg-blue-100 text-blue-800" :
                      r.gender === "Female" ? "bg-pink-100 text-pink-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {r.gender}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 truncate">{r.address}</p>
                  
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleEdit(idx)} className="flex-1 bg-yellow-500 text-white py-2 rounded-lg text-xs font-bold shadow-sm">Edit</button>
                    <button onClick={() => handleDelete(idx)} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs font-bold shadow-sm">Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}