// src/pages/Certificates.tsx
import React, { useState, useEffect } from "react";
import { FaSearch, FaPrint, FaUserCircle, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { getResidents, Resident } from "../services/storage";
import {
  getCertificates,
  saveCertificate,
  updateCertificate,
  deleteCertificate,
  Certificate as CertificateType,
} from "../services/storage";

const CERT_TYPES = [
  { value: "clearance", label: "Barangay Clearance", fee: 50 },
  { value: "indigency", label: "Certificate of Indigency", fee: 30 },
  { value: "residency", label: "Certificate of Residency", fee: 40 },
  { value: "business", label: "Business Permit Recommendation", fee: 100 },
  { value: "jobseeker", label: "First Time Job Seeker", fee: 0 },
];

export default function Certificates() {
  const [residents] = useState<Resident[]>(getResidents());
  const [certificates, setCertificates] = useState<CertificateType[]>([]);
  const [search, setSearch] = useState("");
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [certType, setCertType] = useState("clearance");
  const [purpose, setPurpose] = useState("");

  const [editingCert, setEditingCert] = useState<CertificateType | null>(null);
  const [editForm, setEditForm] = useState({ residentName: "", type: "", purpose: "", fee: 50 });

  const filteredResidents = residents.filter(r =>
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    r.contact.includes(search)
  );

  const selectedCert = CERT_TYPES.find(c => c.value === certType);
  const fee = selectedCert?.fee || 50;

  useEffect(() => {
    setCertificates(getCertificates());
  }, []);

  const handleIssue = () => {
    if (!selectedResident) {
      alert("Please select a resident!");
      return;
    }

    const newCert = {
      residentName: `${selectedResident.firstName} ${selectedResident.lastName}`,
      residentPhoto: selectedResident.photo || "",
      type: selectedCert?.label || "Certificate",
      purpose: purpose.trim() || "whatever legal purpose it may serve",
      fee: fee,
    };

    saveCertificate(newCert);
    setCertificates(getCertificates());
    handlePrint(newCert);
    resetForm();
  };

  const resetForm = () => {
    setSearch("");
    setSelectedResident(null);
    setPurpose("");
    setCertType("clearance");
  };

const handlePrint = (cert: any) => {
  const resident = residents.find(r => 
    `${r.firstName} ${r.lastName}` === cert.residentName
  ) || { gender: "Male" };

  const today = new Date();
  const day = today.getDate();
  const suffix = ["th", "st", "nd", "rd"][day % 10 > 3 ? 0 : day % 10] || "th";
  const fullDate = `${day}${suffix} day of ${today.toLocaleDateString("en-PH", { month: "long", year: "numeric" })}`;

  const printWin = window.open("", "_blank");
  if (!printWin) return;

  // Common body for all certificate types (just like real barangay format)
  const bodyContent = `
    <h1 style="text-align:center; text-decoration:underline; font-size:36px; margin:70px 0 50px;">
      ${cert.type.toUpperCase()}
    </h1>
    <p style="text-align:center; font-size:26px; margin-bottom:70px;">
      TO WHOM IT MAY CONCERN:
    </p>

    <div style="font-size:24px; line-height:2.4; text-align:justify; padding:0 100px;">
      <p style="text-indent:80px; margin-bottom:50px;">
        This is to certify that <strong>${cert.residentName.toUpperCase()}</strong>, of legal age, ${resident.gender.toLowerCase()}, Filipino, 
        ${cert.type === "Certificate of Indigency" 
          ? "widow/widower, is a resident of this Barangay is one of the <strong>indigents</strong> in our barangay." 
          : "and a resident of this barangay, has no derogatory record or pending case filed before this office."}
      </p>

      <p style="text-indent:80px; margin-bottom:100px;">
        ${cert.type === "Certificate of Indigency" 
          ? "This certification is being issued upon the request of the above-named person for whatever legal purpose it may serve her best."
          : `This ${cert.type === "Barangay Clearance" ? "clearance" : "certification"} is being issued for <strong>${cert.purpose || "whatever legal purpose it may serve"}</strong>.`
        }
      </p>

      <p style="text-indent:80px;">
        Issued this <strong>${fullDate}</strong> at the Office of the Punong Barangay, Barangay Rizal, City of Surigao, Philippines.
      </p>
    </div>
  `;

  printWin.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${cert.type}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 20mm 18mm 25mm 18mm;
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 24px;
          line-height: 1.6;
          color: black;
          margin: 0;
          padding: 0;
        }
        .header {
          text-align: center;
          line-height: 1.8;
          margin-bottom: 40px;
        }
        .signature {
          text-align: right;
          margin-top: 120px;
          padding-right: 100px;
        }
        .name {
          border-top: 2px solid black;
          padding-top: 10px;
          display: inline-block;
          width: 420px;
          text-align: center;
          font-weight: bold;
          font-size: 26px;
        }
        .note {
          text-align: center;
          margin-top: 100px;
          font-style: italic;
          color: #333;
          font-size: 22px;
        }
      </style>
    </head>
    <body>

      <div class="header">
        <div style="font-size:22px;">
          Republic of the Philippines<br>
          Province of Surigao del Norte<br>
          City of Surigao<br>
          <strong style="font-size:30px;">BARANGAY RIZAL</strong>
        </div>
        <br>
        <strong style="font-size:28px;">OFFICE OF THE PUNONG BARANGAY</strong>
      </div>

      ${bodyContent}

      <div class="signature">
        <div class="name">
          HON. ROMEO SANCHEZ<br>
          <span style="font-size:22px; font-weight:normal;">Punong Barangay</span>
        </div>
      </div>

      <div class="note">
        <em>NB: No Seal Available</em>
      </div>

    </body>
    </html>
  `);

  printWin.document.close();
  printWin.focus();

  setTimeout(() => {
    printWin.print();
    printWin.close();
  }, 1000);
};

  // Edit & Delete (same as before)
  const openEditModal = (cert: CertificateType) => {
    setEditingCert(cert);
    setEditForm({
      residentName: cert.residentName,
      type: cert.type,
      purpose: cert.purpose,
      fee: cert.fee,
    });
  };

  const saveEdit = () => {
    if (!editingCert) return;
    const index = certificates.findIndex(c => c.controlNo === editingCert.controlNo);
    if (index !== -1) {
      updateCertificate(index, { ...editingCert, ...editForm, fee: Number(editForm.fee) });
      setCertificates(getCertificates());
      setEditingCert(null);
    }
  };

  const confirmDelete = (index: number) => {
    if (window.confirm("Permanently delete this certificate?")) {
      deleteCertificate(index);
      setCertificates(getCertificates());
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      <h1 className="text-5xl font-bold text-center text-green-800">CERTIFICATE ISSUANCE</h1>

      {/* Issue Section */}
      <div className="bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-3xl font-bold text-green-700 mb-8">Issue New Certificate</h2>

        <div className="relative max-w-2xl mx-auto mb-8">
          <FaSearch className="absolute left-6 top-6 text-2xl text-gray-500" />
          <input
            type="text"
            placeholder="Search resident..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-8 py-6 text-xl border-4 border-gray-300 rounded-2xl focus:border-green-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {filteredResidents.map((r) => (
            <div
              key={r.contact}
              onClick={() => setSelectedResident(r)}
              className={`p-6 rounded-2xl border-4 cursor-pointer transition-all ${
                selectedResident?.contact === r.contact
                  ? "border-green-600 bg-green-50 shadow-2xl"
                  : "border-gray-200 hover:border-green-400"
              }`}
            >
              {r.photo ? (
                <img src={r.photo} className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-green-700" />
              ) : (
                <FaUserCircle className="w-20 h-20 mx-auto text-gray-400" />
              )}
              <p className="text-center font-bold mt-3">{r.firstName} {r.lastName}</p>
            </div>
          ))}
        </div>

        {selectedResident && (
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <select value={certType} onChange={(e) => setCertType(e.target.value)} className="w-full px-8 py-5 text-xl rounded-2xl border-4">
                {CERT_TYPES.map(c => (
                  <option key={c.value} value={c.value}>{c.label} — ₱{c.fee}</option>
                ))}
              </select>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Purpose (optional)"
                className="w-full px-8 py-5 text-xl rounded-2xl border-4"
              />
              <div className="bg-yellow-100 p-8 rounded-3xl text-center">
                <p className="text-4xl font-black text-green-600">₱{fee}.00</p>
              </div>
              <button
                onClick={handleIssue}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-8 rounded-3xl font-bold text-3xl flex items-center justify-center gap-6"
              >
                <FaPrint className="text-5xl" />
                ISSUE & PRINT CERTIFICATE
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      <div className="bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-bold text-green-800 mb-8 text-center">Certificate History</h2>
        {certificates.slice().reverse().map((cert, idx) => {
          const originalIndex = certificates.length - 1 - idx;
          return (
            <div key={cert.controlNo} className="mb-6 p-6 bg-green-50 rounded-2xl flex justify-between items-center">
              <div className="flex items-center gap-6">
                {cert.residentPhoto ? <img src={cert.residentPhoto} className="w-16 h-16 rounded-full" /> : <FaUserCircle className="w-16 h-16" />}
                <div>
                  <p className="font-bold text-xl">{cert.residentName}</p>
                  <p>{cert.type} • {cert.purpose}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-green-600">₱{cert.fee}</span>
                <button onClick={() => handlePrint(cert)} className="bg-blue-600 text-white p-3 rounded"><FaPrint /></button>
                <button onClick={() => openEditModal(cert)} className="bg-yellow-500 text-white p-3 rounded"><FaEdit /></button>
                <button onClick={() => confirmDelete(originalIndex)} className="bg-red-600 text-white p-3 rounded"><FaTrash /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingCert && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 max-w-2xl w-full">
            <h3 className="text-3xl font-bold mb-6">Edit Certificate</h3>
            <input value={editForm.residentName} onChange={(e) => setEditForm({...editForm, residentName: e.target.value})} className="w-full p-4 border mb-4" />
            <input value={editForm.purpose} onChange={(e) => setEditForm({...editForm, purpose: e.target.value})} className="w-full p-4 border mb-4" />
            <select value={editForm.type} onChange={(e) => setEditForm({...editForm, type: e.target.value})} className="w-full p-4 border mb-4">
              {CERT_TYPES.map(c => <option key={c.value}>{c.label}</option>)}
            </select>
            <input type="number" value={editForm.fee} onChange={(e) => setEditForm({...editForm, fee: Number(e.target.value)})} className="w-full p-4 border mb-6" />
            <div className="flex gap-4">
              <button onClick={saveEdit} className="flex-1 bg-green-600 text-white py-4 rounded">Save</button>
              <button onClick={() => setEditingCert(null)} className="flex-1 bg-gray-600 text-white py-4 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}