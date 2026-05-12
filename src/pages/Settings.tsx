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
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 text-sm">System configuration and account management</p>
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition shadow-sm"
          >
            Save All Changes
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-10">
          
          {/* Section: Barangay Profile */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Barangay Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white mb-4">
                  {settings.barangayLogo ? (
                    <img src={settings.barangayLogo} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs text-center font-bold">No Logo</div>
                  )}
                </div>
                <label className="text-blue-600 hover:text-blue-700 text-sm font-bold cursor-pointer">
                  Change Logo
                  <input type="file" accept="image/*" hidden onChange={(e) => handleFileUpload(e, "barangayLogo")} />
                </label>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Barangay Name</label>
                  <input
                    name="barangayName"
                    type="text"
                    value={settings.barangayName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Contact Number</label>
                  <input
                    name="contactNumber"
                    type="text"
                    value={settings.contactNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Office Address</label>
                  <input
                    name="address"
                    type="text"
                    value={settings.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Section: Issuance Logic */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                Certificate Settings
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">ID Prefix</label>
                    <input
                      name="certificatePrefix"
                      type="text"
                      value={settings.certificatePrefix}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Start Number</label>
                    <input
                      name="startingNumber"
                      type="number"
                      value={settings.startingNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Default Template Text</label>
                  <textarea
                    name="certificateTemplate"
                    value={settings.certificateTemplate}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition resize-none text-sm"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Use {"{{name}}"} and {"{{purpose}}"} for auto-fill.</p>
                </div>
              </div>
            </section>

            {/* Section: Officials */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-green-600 rounded-full"></span>
                Barangay Officials
              </h2>
              <div className="border rounded-xl overflow-hidden">
                <div className="p-4 bg-gray-50 border-b space-y-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                    value={newOfficial.name}
                    onChange={(e) => setNewOfficial({ ...newOfficial, name: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Position"
                      className="flex-1 px-3 py-2 text-sm border rounded-lg"
                      value={newOfficial.position}
                      onChange={(e) => setNewOfficial({ ...newOfficial, position: e.target.value })}
                    />
                    <button onClick={addOfficial} className="bg-green-600 text-white px-4 rounded-lg text-sm font-bold">Add</button>
                  </div>
                </div>
                <div className="max-h-40 overflow-y-auto divide-y">
                  {officials.length > 0 ? officials.map(o => (
                    <div key={o.id} className="p-3 flex justify-between items-center bg-white text-sm">
                      <div>
                        <p className="font-bold">{o.name}</p>
                        <p className="text-xs text-gray-500">{o.position}</p>
                      </div>
                      <button onClick={() => removeOfficial(o.id)} className="text-red-500 hover:text-red-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  )) : (
                    <p className="p-4 text-center text-gray-400 text-xs italic">No officials added.</p>
                  )}
                </div>
              </div>
            </section>

          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Section: Security */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                Security
              </h2>
              <div className="space-y-4 max-w-sm">
                <input
                  type="password"
                  placeholder="Old Password"
                  className="w-full px-4 py-2.5 border rounded-lg text-sm"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full px-4 py-2.5 border rounded-lg text-sm"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-2.5 border rounded-lg text-sm"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
                {passwordStatus && <p className={`text-xs font-bold ${passwordStatus.includes("success") ? "text-green-600" : "text-red-600"}`}>{passwordStatus}</p>}
                <button
                  onClick={handleChangePassword}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-bold text-sm transition shadow-sm"
                >
                  Update Password
                </button>
              </div>
            </section>

            {/* Section: System */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gray-600 rounded-full"></span>
                System
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={backupData} className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-bold text-sm shadow-sm transition">
                  Export Backup
                </button>
                <label className="bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg font-bold text-sm shadow-sm transition text-center cursor-pointer">
                  Import Backup
                  <input type="file" hidden onChange={restoreData} />
                </label>
                <button onClick={resetSystem} className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-bold text-sm shadow-sm transition sm:col-span-2">
                  Factory Reset
                </button>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
