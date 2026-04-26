// src/services/storage.ts

// ---------- Residents ----------
export interface Resident {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  address: string;
  contact: string;
  photo?: string; // Base64 photo
}

export const getResidents = (): Resident[] => {
  const data = localStorage.getItem("residents");
  return data ? JSON.parse(data) : [];
};

export const saveResident = (resident: Resident): void => {
  const residents = getResidents();
  residents.push(resident);
  localStorage.setItem("residents", JSON.stringify(residents));
};

export const updateResident = (index: number, resident: Resident): void => {
  const residents = getResidents();
  residents[index] = resident;
  localStorage.setItem("residents", JSON.stringify(residents));
};

export const deleteResident = (index: number): void => {
  const residents = getResidents();
  residents.splice(index, 1);
  localStorage.setItem("residents", JSON.stringify(residents));
};

// ---------- Blotters ----------
export interface Blotter {
  complainant: string;
  offender: string;
  caseType: string;
  description: string;
  resolved?: boolean;
}

export const getBlotters = (): Blotter[] => {
  const data = localStorage.getItem("blotters");
  return data ? JSON.parse(data) : [];
};

export const saveBlotter = (blotter: Blotter): void => {
  const blotters = getBlotters();
  blotters.push(blotter);
  localStorage.setItem("blotters", JSON.stringify(blotters));
};

export const updateBlotter = (index: number, blotter: Blotter): void => {
  const blotters = getBlotters();
  blotters[index] = blotter;
  localStorage.setItem("blotters", JSON.stringify(blotters));
};

export const deleteBlotter = (index: number): void => {
  const blotters = getBlotters();
  blotters.splice(index, 1);
  localStorage.setItem("blotters", JSON.stringify(blotters));
};

// ---------- Certificates (UPDATED with photo & control number) ----------
export interface Certificate {
  residentName: string;
  residentPhoto?: string;     // ← NEW: Save photo
  type: string;
  purpose: string;
  fee: number;
  dateIssued: string;         // ISO string
  controlNo: string;          // ← NEW: Control number
}

export const getCertificates = (): Certificate[] => {
  const data = localStorage.getItem("certificates");
  return data ? JSON.parse(data) : [];
};

export const saveCertificate = (certificate: Omit<Certificate, "dateIssued" | "controlNo">): void => {
  const certificates = getCertificates();
  const newCert: Certificate = {
    ...certificate,
    dateIssued: new Date().toISOString(),
    controlNo: `BRGY-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 999).toString().padStart(3, "0")}`,
  };
  certificates.push(newCert);
  localStorage.setItem("certificates", JSON.stringify(certificates));
};

export const updateCertificate = (index: number, certificate: Certificate): void => {
  const certificates = getCertificates();
  certificates[index] = certificate;
  localStorage.setItem("certificates", JSON.stringify(certificates));
};

export const deleteCertificate = (index: number): void => {
  const certificates = getCertificates();
  certificates.splice(index, 1);
  localStorage.setItem("certificates", JSON.stringify(certificates));
};

// ========== REVENUE FUNCTIONS (IMPROVED & ACCURATE) ==========

export const getMonthlyRevenue = (year?: number, month?: number): number => {
  const certificates = getCertificates();
  const now = new Date();
  const targetYear = year ?? now.getFullYear();
  const targetMonth = month !== undefined ? month : now.getMonth();

  return certificates
    .filter((cert) => {
      const certDate = new Date(cert.dateIssued);
      return certDate.getFullYear() === targetYear && certDate.getMonth() === targetMonth;
    })
    .reduce((total, cert) => total + cert.fee, 0);
};

export const getCurrentMonthRevenue = (): number => getMonthlyRevenue();

export const getRevenueLast4Months = () => {
  const now = new Date();
  const data = [];

  for (let i = 3; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const revenue = getMonthlyRevenue(date.getFullYear(), date.getMonth());

    data.push({
      month: date.toLocaleDateString("en-PH", { month: "short" }),
      amount: revenue,
      label: date.toLocaleDateString("en-PH", { month: "short", year: "numeric" }),
    });
  }

  return data;
};

export const getTotalRevenueAllTime = (): number => {
  return getCertificates().reduce((total, cert) => total + cert.fee, 0);
};