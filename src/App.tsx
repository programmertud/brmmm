// src/App.tsx
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

// Context
import { useAuth } from "./context/AuthContext";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";

// Public Resident Services
import Apply from "./pages/public/Apply";
import Complaints from "./pages/public/Complaints";
import Announcements from "./pages/public/Announcements";
import Status from "./pages/public/Status";

// Admin Pages
import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";
import Certificates from "./pages/Certificates";
import Blotter from "./pages/Blotter";
import Officials from "./pages/Officials";
import Settings from "./pages/Settings";
import Requests from "./pages/Requests";
import AdminComplaints from "./pages/AdminComplaints";
import AdminAnnouncements from "./pages/AdminAnnouncements";

import Sidebar from "./components/Sidebar";
import Logo from "./assets/logo.png";

// Separate AdminLayout to avoid re-definition and scope issues
const AdminLayout = ({ 
  collapsed, 
  setCollapsed, 
  mobileOpen, 
  setMobileOpen 
}: any) => (
  <div className="flex min-h-screen bg-slate-50 relative">
    <Sidebar 
      onToggle={setCollapsed} 
      mobileOpen={mobileOpen} 
      setMobileOpen={setMobileOpen} 
    />

    <div className={`flex-1 transition-all duration-300 flex flex-col ${collapsed ? "lg:ml-20" : "lg:ml-64"} ml-0`}>
      <header className="lg:hidden bg-green-900 text-white p-4 flex items-center justify-between shadow-lg sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-yellow-400 bg-white overflow-hidden">
             <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-yellow-300 tracking-tight">BARANGAY RIZAL</span>
        </div>
        <button 
          onClick={() => setMobileOpen(true)}
          className="p-2 bg-green-800 rounded-lg hover:bg-green-700 transition"
        >
          <FaBars className="text-2xl text-yellow-400" />
        </button>
      </header>

      <main className="p-4 md:p-6 lg:p-8 min-h-screen bg-gray-100">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/complaints" element={<AdminComplaints />} />
          <Route path="/announcements" element={<AdminAnnouncements />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/blotter" element={<Blotter />} />
          <Route path="/officials" element={<Officials />} />
          <Route path="/settings" element={<Settings />} />
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  </div>
);

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-900 to-green-700">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-t-yellow-500 border-white rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white text-2xl font-bold">Barangay Rizal System</p>
          <p className="text-yellow-300 text-lg">Loading securely...</p>
        </div>
      </div>
    );
  }

  const ResidentRoute = ({ children }: { children: React.ReactNode }) => children;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/apply" element={<ResidentRoute><Apply /></ResidentRoute>} />
      <Route path="/complaints" element={<ResidentRoute><Complaints /></ResidentRoute>} />
      <Route path="/announcements" element={<ResidentRoute><Announcements /></ResidentRoute>} />
      <Route path="/officials" element={<ResidentRoute><Officials /></ResidentRoute>} />
      <Route path="/status" element={<ResidentRoute><Status /></ResidentRoute>} />

      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Login />}
      />

      <Route
        path="/admin/*"
        element={
          isAuthenticated ? (
            <AdminLayout 
              collapsed={collapsed} 
              setCollapsed={setCollapsed} 
              mobileOpen={mobileOpen} 
              setMobileOpen={setMobileOpen} 
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/admin/dashboard" : "/"} replace />}
      />
    </Routes>
  );
}