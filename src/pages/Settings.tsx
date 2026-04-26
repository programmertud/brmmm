import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

/* -------------------------------
   INTERFACES
--------------------------------*/
interface SettingsData {
  barangayName: string;
  address: string;
  contactNumber: string;
  darkMode: boolean;
  themeColor: string;
  barangayLogo: string | null;
  captainSignature: string | null;
  secretarySignature: string | null;
  certificatePrefix: string;
  startingNumber: number;
  certificateTemplate: string;
}

interface Official {
  id: number;
  name: string;
  position: string;
}

export default function Settings() {
  /* -------------------------------
     DEFAULT SETTINGS
  --------------------------------*/
  const [settings, setSettings] = useState<SettingsData>({
    barangayName: "",
    address: "",
    contactNumber: "",
    darkMode: false,
    themeColor: "blue",
    barangayLogo: null,
    captainSignature: null,
    secretarySignature: null,
    certificatePrefix: "BRGY",
    startingNumber: 1,
    certificateTemplate:
      "This certificate is issued to {{name}} for {{purpose}} on this day.",
  });

  const [officials, setOfficials] = useState<Official[]>([]);
  const [newOfficial, setNewOfficial] = useState({ name: "", position: "" });
  
  // Account Security State
  const { user } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState("");

  /* -------------------------------
     LOAD SETTINGS FROM LOCALSTORAGE
  --------------------------------*/
  useEffect(() => {
    const stored = localStorage.getItem("barangaySettings");
    const storedOfficials = localStorage.getItem("barangayOfficials");

    if (stored) setSettings(JSON.parse(stored));
    if (storedOfficials) setOfficials(JSON.parse(storedOfficials));
  }, []);

  /* -------------------------------
     HANDLE INPUT CHANGES
  --------------------------------*/
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* -------------------------------
     LOGO & SIGNATURE UPLOADERS
  --------------------------------*/
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "barangayLogo" | "captainSignature" | "secretarySignature"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSettings((prev) => ({
        ...prev,
        [key]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  /* -------------------------------
     ADD BARANGAY OFFICIAL
  --------------------------------*/
  const addOfficial = () => {
    if (!newOfficial.name || !newOfficial.position) return;

    const updated = [
      ...officials,
      { id: Date.now(), name: newOfficial.name, position: newOfficial.position },
    ];

    setOfficials(updated);
    setNewOfficial({ name: "", position: "" });

    localStorage.setItem("barangayOfficials", JSON.stringify(updated));
  };

  const removeOfficial = (id: number) => {
    const updated = officials.filter((o) => o.id !== id);
    setOfficials(updated);
    localStorage.setItem("barangayOfficials", JSON.stringify(updated));
  };

  /* -------------------------------
     SAVE MAIN SETTINGS
  --------------------------------*/
  const handleSave = () => {
    localStorage.setItem("barangaySettings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  /* -------------------------------
     BACKUP & RESTORE
  --------------------------------*/
  const backupData = () => {
    const data = {
      settings,
      residents: localStorage.getItem("residents"),
      blotters: localStorage.getItem("blotters"),
      certificates: localStorage.getItem("certificates"),
      officials,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "barangay-backup.json";
    link.click();
  };

  const restoreData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const json = JSON.parse(reader.result as string);

      localStorage.setItem("barangaySettings", JSON.stringify(json.settings));
      localStorage.setItem("residents", json.residents);
      localStorage.setItem("blotters", json.blotters);
      localStorage.setItem("certificates", json.certificates);
      localStorage.setItem("barangayOfficials", JSON.stringify(json.officials));

      alert("System restored successfully! Refresh the page.");
    };
    reader.readAsText(file);
  };

  const resetSystem = () => {
    if (!confirm("This will delete all data. Continue?")) return;
    localStorage.clear();
    alert("System reset! Reloading...");
    location.reload();
  };

  const handleChangePassword = async () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      setPasswordStatus("All fields are required");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus("New passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus("Password must be at least 6 characters");
      return;
    }

    try {
      await api.post("/auth/change-password", {
        username: user?.username,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordStatus("Password updated successfully!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setPasswordStatus(err.response?.data?.message || "Failed to update password");
    }
  };

  /* --------------------------------
     UI RENDER
  --------------------------------*/
  return (
    <div className="max-w-5xl mx-auto mt-4 md:mt-6 bg-white dark:bg-gray-800 p-4 md:p-8 rounded-xl shadow-md">

      <h1 className="text-2xl md:text-3xl font-bold mb-6">⚙ Settings</h1>

      {/* -----------------------------------------------------
           SECTION: BARANGAY INFORMATION
      ------------------------------------------------------ */}
      {/* -----------------------------------------------------
           SECTION: BARANGAY INFORMATION
      ------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Barangay Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Logo */}
          <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl">
            <div className="w-24 h-24 border-4 border-yellow-400 rounded-full overflow-hidden shadow-lg flex-shrink-0">
               {settings.barangayLogo ? (
                 <img src={settings.barangayLogo} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Logo</div>
               )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <label className="block font-bold text-gray-700 mb-2">Upload Barangay Logo</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFileUpload(e, "barangayLogo")} 
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Barangay Name */}
          <div>
            <label className="font-medium block mb-1">Barangay Name</label>
            <input
              name="barangayName"
              type="text"
              value={settings.barangayName}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Address */}
          <div>
            <label className="font-medium block mb-1">Address</label>
            <input
              name="address"
              type="text"
              value={settings.address}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="font-medium block mb-1">Contact Number</label>
            <input
              name="contactNumber"
              type="text"
              value={settings.contactNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>
      </section>

      {/* -----------------------------------------------------
           SECTION: BARANGAY OFFICIALS
      ------------------------------------------------------ */}
      {/* -----------------------------------------------------
           SECTION: BARANGAY OFFICIALS
      ------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-green-800">Barangay Officials</h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Official Name"
            className="flex-1 border p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
            value={newOfficial.name}
            onChange={(e) => setNewOfficial({ ...newOfficial, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Position (e.g. Captain)"
            className="flex-1 border p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
            value={newOfficial.position}
            onChange={(e) => setNewOfficial({ ...newOfficial, position: e.target.value })}
          />
          <button onClick={addOfficial} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition">
            Add Official
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border shadow-sm border-gray-200">
          <table className="w-full border-collapse min-w-[500px]">
            <thead className="bg-green-50 dark:bg-gray-700">
              <tr>
                <th className="p-4 border text-left text-green-800 font-bold">Name</th>
                <th className="p-4 border text-left text-green-800 font-bold">Position</th>
                <th className="p-4 border text-center text-green-800 font-bold">Action</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {officials.length > 0 ? officials.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition text-sm md:text-base">
                  <td className="p-4 border">{o.name}</td>
                  <td className="p-4 border font-medium text-gray-700">{o.position}</td>
                  <td className="p-4 border text-center">
                    <button
                      onClick={() => removeOfficial(o.id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-400 italic">No officials added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* -----------------------------------------------------
           SECTION: CERTIFICATE TEMPLATE
      ------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Certificate Template</h2>

        <textarea
          name="certificateTemplate"
          value={settings.certificateTemplate}
          onChange={handleChange}
          className="w-full h-40 border p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="Enter the default template text for certificates..."
        ></textarea>

        <p className="text-sm mt-3 text-gray-500 flex flex-wrap items-center gap-2">
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono text-xs">{"{{name}}"}</span>
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono text-xs">{"{{purpose}}"}</span>
          <span>Use these tags to auto-fill details.</span>
        </p>
      </section>

      {/* -----------------------------------------------------
           SECTION: BACKUP & RESTORE
      ------------------------------------------------------ */}
      <section className="mb-12 bg-slate-50 p-4 md:p-6 rounded-2xl border-2 border-slate-100">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">System Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={backupData} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-4 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2">
            Backup System
          </button>

          <label className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-4 rounded-xl font-bold shadow-lg transition cursor-pointer flex items-center justify-center gap-2 text-center">
            Restore System
            <input type="file" hidden onChange={restoreData} />
          </label>

          <button onClick={resetSystem} className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-4 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2">
            Reset Data
          </button>
        </div>
      </section>

      {/* -----------------------------------------------------
           SECTION: ACCOUNT SECURITY (NEW)
      ------------------------------------------------------ */}
      <section className="mb-12 border-t pt-8">
        <h2 className="text-xl font-semibold mb-4 text-red-700">Account Security</h2>
        <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-100 max-w-md">
          <p className="text-sm text-red-600 mb-4">Change your administrative password</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-xl"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-xl"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-xl"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
            
            {passwordStatus && (
              <p className={`text-sm font-bold ${passwordStatus.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {passwordStatus}
              </p>
            )}

            <button
              onClick={handleChangePassword}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition shadow-lg"
            >
              Update Password
            </button>
          </div>
        </div>
      </section>

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl transition transform hover:scale-[1.02]"
      >
        Save All Settings
      </button>
    </div>
  );
}
