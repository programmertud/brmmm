// src/components/Sidebar.tsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaFileAlt,
  FaBook,
  FaCog,
  FaBars,
  FaSignOutAlt,
  FaUserCircle,
  FaUserTie,
  FaClipboardList,
  FaCommentDots,
  FaBullhorn,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

import Logo from "../assets/logo.png";

export default function Sidebar({ 
  onToggle, 
  mobileOpen, 
  setMobileOpen 
}: { 
  onToggle: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onToggle(newState);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    if (setMobileOpen) setMobileOpen(false);
  };

  const menuItems = [
    { name: "Dashboard",    path: "/admin/dashboard",    icon: <FaHome /> },
    { name: "Requests",     path: "/admin/requests",     icon: <FaClipboardList className="text-xl" /> },
    { name: "Complaints",   path: "/admin/complaints",   icon: <FaCommentDots /> },
    { name: "Announcements", path: "/admin/announcements", icon: <FaBullhorn /> },
    { name: "Residents",    path: "/admin/residents",    icon: <FaUsers /> },
    { name: "Certificates", path: "/admin/certificates", icon: <FaFileAlt /> },
    { name: "Blotter",      path: "/admin/blotter",      icon: <FaBook /> },
    { name: "Officials",    path: "/admin/officials",    icon: <FaUserTie className="text-xl" /> },
    { name: "Settings",     path: "/admin/settings",     icon: <FaCog /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen?.(false)}
        />
      )}

      <div
        className={`
          h-screen fixed top-0 left-0 bg-gradient-to-b from-green-900 to-green-800 text-white
          flex flex-col transition-all duration-300 z-50 shadow-2xl border-r border-green-700 overflow-y-auto
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-green-700">
          <div className="flex items-center gap-4 overflow-hidden">
            <img
              src={Logo}
              alt="Barangay Logo"
              className={`${
                collapsed ? "w-10 h-10" : "w-14 h-14"
              } rounded-full border-4 border-yellow-400 shadow-2xl object-cover transition-all`}
            />
            {(!collapsed || mobileOpen) && (
              <div>
                <h1 className="text-xl font-bold text-yellow-300">BARANGAY RIZAL</h1>
                <p className="text-xs text-green-200">Admin Panel</p>
              </div>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="hidden lg:block p-2 rounded-lg bg-green-700 hover:bg-green-600 transition shadow-md"
            title={collapsed ? "Expand" : "Collapse"}
          >
            <FaBars className="text-xl" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 mt-6 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen?.(false)}
                className={`
                  flex items-center gap-4 px-4 py-4 mb-2 rounded-xl text-sm font-semibold
                  transition-all duration-300 group relative
                  ${isActive
                    ? "bg-yellow-500 text-green-900 shadow-lg ring-4 ring-yellow-300 scale-105"
                    : "hover:bg-green-700 hover:shadow-md hover:translate-x-1"
                  }
                `}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                {(!collapsed || mobileOpen) && (
                  <span className="truncate">{item.name}</span>
                )}
                {collapsed && !mobileOpen && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-green-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-green-700 p-4 bg-green-900/50">
          <div className={`${(collapsed && !mobileOpen) ? "text-center" : "space-y-3"}`}>
            {/* User Info */}
            {(!collapsed || mobileOpen) && user && (
              <div className="flex items-center gap-3 pb-3 border-b border-green-700">
                <FaUserCircle className="text-3xl text-yellow-400" />
                <div>
                  <p className="font-bold text-yellow-300">{user.username}</p>
                  <p className="text-xs text-green-200 capitalize">{user.role}</p>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center justify-center gap-3 px-4 py-3 
                bg-red-600 hover:bg-red-700 rounded-xl font-bold text-sm
                transition-all duration-300 shadow-lg hover:shadow-red-500/50 transform hover:scale-105
                ${(collapsed && !mobileOpen) ? "py-4" : ""}
              `}
            >
              <FaSignOutAlt className="text-xl" />
              {(!collapsed || mobileOpen) && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* Footer */}
        {(!collapsed || mobileOpen) && (
          <div className="p-4 text-center text-xs text-green-300 border-t border-green-700 bg-green-900/70">
            <p>v1.0.2 • © 2025</p>
            <p className="mt-1">City of Surigao</p>
          </div>
        )}
      </div>
    </>
  );
}