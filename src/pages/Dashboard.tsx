// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaUsers,
  FaFileAlt,
  FaBook,
  FaMoneyBill,
  FaCog,
  FaUserTie,
  FaClipboardList,    // ← NEW: For Requests
  FaExclamationCircle, // ← For pending count
  FaCommentDots,
  FaBullhorn,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../services/api";

import {
  getResidents,
  getBlotters,
  getCertificates,
  getCurrentMonthRevenue,
  getRevenueLast4Months,
} from "../services/storage";

const COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B"];

export default function Dashboard() {
  const [residentsData, setResidentsData] = useState({
    total: 0,
    male: 0,
    female: 0,
    seniors: 0,
  });

  const [certificatesData, setCertificatesData] = useState({
    issuedToday: 0,
    issuedThisMonth: 0,
  });

  const [blotterData, setBlotterData] = useState({
    totalCases: 0,
    unresolved: 0,
  });

  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [revenueChartData, setRevenueChartData] = useState<any[]>([]);
  
  // ← NEW: Count pending resident requests
  const [pendingRequests, setPendingRequests] = useState(0);
  const [complaintsCount, setComplaintsCount] = useState(0);
  const [announcementsCount, setAnnouncementsCount] = useState(0);

  useEffect(() => {
    const residents = getResidents();
    const blotters = getBlotters();
    const certificates = getCertificates();

    // Resident demographics
    const male = residents.filter((r) => r.gender === "Male").length;
    const female = residents.filter((r) => r.gender === "Female").length;
    const seniors = residents.filter((r) => {
      const age = parseInt(r.age || "0", 10);
      return age >= 60;
    }).length;

    setResidentsData({ total: residents.length, male, female, seniors });

    // Certificates
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    const issuedToday = certificates.filter((c) => c.dateIssued.startsWith(todayStr)).length;
    const issuedThisMonth = certificates.filter((c) => {
      const date = new Date(c.dateIssued);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).length;

    setCertificatesData({ issuedToday, issuedThisMonth });

    // Blotter
    const unresolved = blotters.filter((b) => !b.resolved).length;
    setBlotterData({ totalCases: blotters.length, unresolved });

    // Revenue
    setMonthlyRevenue(getCurrentMonthRevenue());
    setRevenueChartData(getRevenueLast4Months());

    // Backend-powered stats
    const loadBackendStats = async () => {
      try {
        const [appsRes, complaintsRes, announcementsRes] = await Promise.all([
          api.get("/applications"),
          api.get("/complaints"),
          api.get("/announcements"),
        ]);

        const applications = appsRes.data || [];
        const pending = applications.filter((app: any) => app.status === "Pending").length;
        setPendingRequests(pending);

        setComplaintsCount((complaintsRes.data || []).length);
        setAnnouncementsCount((announcementsRes.data || []).length);
      } catch (error) {
        console.error("Failed to load dashboard stats from backend", error);
      }
    };

    loadBackendStats();
  }, []);

  const demographicData = [
    { name: "Male", value: residentsData.male },
    { name: "Female", value: residentsData.female },
    { name: "Seniors (60+)", value: residentsData.seniors },
    {
      name: "Others",
      value: residentsData.total - residentsData.male - residentsData.female - residentsData.seniors,
    },
  ];

  return (
    <div className="space-y-10 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-green-800">
        Barangay Rizal Management System
      </h1>

      {/* Summary Cards - main stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Residents */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-blue-600 flex items-center gap-5 hover:shadow-2xl transition">
          <FaUsers className="text-6xl text-blue-600" />
          <div>
            <p className="text-gray-600 font-medium">Total Residents</p>
            <p className="text-4xl font-bold text-blue-700">{residentsData.total}</p>
          </div>
        </div>

        {/* Pending Requests - NEW */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-orange-600 flex items-center gap-5 hover:shadow-2xl transition relative overflow-hidden">
          <FaClipboardList className="text-6xl text-orange-600" />
          <div>
            <p className="text-gray-600 font-medium">Pending Requests</p>
            <p className="text-4xl font-bold text-orange-700">{pendingRequests}</p>
            {pendingRequests > 0 && (
              <div className="absolute top-2 right-2 animate-ping">
                <FaExclamationCircle className="text-3xl text-red-600" />
              </div>
            )}
          </div>
        </div>

        {/* Certificates This Month */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-green-600 flex items-center gap-5 hover:shadow-2xl transition">
          <FaFileAlt className="text-6xl text-green-600" />
          <div>
            <p className="text-gray-600 font-medium">Certificates This Month</p>
            <p className="text-4xl font-bold text-green-700">{certificatesData.issuedThisMonth}</p>
          </div>
        </div>

        {/* Unresolved Blotter */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-red-600 flex items-center gap-5 hover:shadow-2xl transition">
          <FaBook className="text-6xl text-red-600" />
          <div>
            <p className="text-gray-600 font-medium">Unresolved Blotter</p>
            <p className="text-4xl font-bold text-red-700">{blotterData.unresolved}</p>
            <p className="text-sm text-gray-500">of {blotterData.totalCases} cases</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-yellow-500 flex items-center gap-5 hover:shadow-2xl transition">
          <FaMoneyBill className="text-6xl text-yellow-500" />
          <div>
            <p className="text-gray-600 font-medium">Revenue This Month</p>
            <p className="text-4xl font-bold text-yellow-600">
              ₱{monthlyRevenue.toLocaleString("en-PH")}
            </p>
          </div>
        </div>
      </div>

      {/* Secondary summary cards: Complaints & Announcements */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-red-500 flex items-center gap-5 hover:shadow-2xl transition">
          <FaCommentDots className="text-6xl text-red-500" />
          <div>
            <p className="text-gray-600 font-medium">Complaints</p>
            <p className="text-4xl font-bold text-red-700">{complaintsCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-blue-500 flex items-center gap-5 hover:shadow-2xl transition">
          <FaBullhorn className="text-6xl text-blue-500" />
          <div>
            <p className="text-gray-600 font-medium">Announcements</p>
            <p className="text-4xl font-bold text-blue-700">{announcementsCount}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Population Demographics</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={demographicData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {demographicData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Revenue Trend (Last 4 Months)</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `₱${value.toLocaleString("en-PH")}`} />
              <Line type="monotone" dataKey="amount" stroke="#f59e0b" strokeWidth={5} dot={{ fill: "#f59e0b", r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* QUICK ACTIONS - Now with Requests */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Residents */}
          <Link
            to="/admin/residents"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl transform hover:-translate-y-3 transition-all duration-300"
          >
            <FaUsers className="text-6xl mb-4" />
            <span className="text-xl font-bold text-center">Manage Residents</span>
          </Link>

          {/* Requests - NEW */}
          <Link
            to="/admin/requests"
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl transform hover:-translate-y-3 transition-all duration-300 relative overflow-hidden"
          >
            <FaClipboardList className="text-6xl mb-4" />
            <span className="text-xl font-bold text-center">Resident Requests</span>
            {pendingRequests > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg animate-pulse">
                {pendingRequests}
              </div>
            )}
          </Link>

          {/* Certificates */}
          <Link
            to="/admin/certificates"
            className="bg-green-600 hover:bg-green-700 text-white rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl transform hover:-translate-y-3 transition-all duration-300"
          >
            <FaFileAlt className="text-6xl mb-4" />
            <span className="text-xl font-bold text-center">Issue Certificate</span>
          </Link>

          {/* Blotter */}
          <Link
            to="/admin/blotter"
            className="bg-red-600 hover:bg-red-700 text-white rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl transform hover:-translate-y-3 transition-all duration-300"
          >
            <FaBook className="text-6xl mb-4" />
            <span className="text-xl font-bold text-center">Blotter Records</span>
          </Link>

          {/* Complaints */}
          <Link
            to="/admin/complaints"
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl transform hover:-translate-y-3 transition-all duration-300"
          >
            <FaCommentDots className="text-6xl mb-4" />
            <span className="text-xl font-bold text-center">View Complaints</span>
          </Link>

          {/* Announcements */}
          <Link
            to="/admin/announcements"
            className="bg-sky-600 hover:bg-sky-700 text-white rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl transform hover:-translate-y-3 transition-all duration-300"
          >
            <FaBullhorn className="text-6xl mb-4" />
            <span className="text-xl font-bold text-center">View Announcements</span>
          </Link>

          {/* Officials */}
          <Link
            to="/admin/officials"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl transform hover:-translate-y-3 transition-all duration-300"
          >
            <FaUserTie className="text-6xl mb-4" />
            <span className="text-xl font-bold text-center">Barangay Officials</span>
          </Link>

          {/* Settings */}
          <Link
            to="/admin/settings"
            className="bg-gray-800 hover:bg-gray-900 text-white rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl transform hover:-translate-y-3 transition-all duration-300"
          >
            <FaCog className="text-6xl mb-4" />
            <span className="text-xl font-bold text-center">Settings</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-600 mt-20 pb-10">
        <p className="text-lg font-medium">
          Barangay Rizal Management System • © {new Date().getFullYear()} • Version 1.0.2
        </p>
      </footer>
    </div>
  );
}