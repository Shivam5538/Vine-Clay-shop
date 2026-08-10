"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAdminStore } from "../store/useAdminStore";
import { formatTime } from "@/lib/format-date";
import { Bell, Shield, Zap } from "lucide-react";
import { UserRole } from "../types/admin";

export function AdminHeader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    isRealtimeEnabled,
    toggleRealtime,
    currentRole,
    setCurrentRole,
    simulateIncomingOrder,
    activityLogs,
  } = useAdminStore();

  const getSingleWordTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    if (pathname.startsWith("/admin/orders")) return "Orders";
    if (pathname.startsWith("/admin/bookings")) return "Bookings";
    if (pathname.startsWith("/admin/locations")) return "Locations";
    if (pathname.startsWith("/admin/menu")) return "Menu";
    if (pathname.startsWith("/admin/customers")) return "Customers";
    if (pathname.startsWith("/admin/messages")) return "Messages";
    if (pathname.startsWith("/admin/settings")) return "Settings";
    if (pathname.startsWith("/admin/styleguide")) return "Styleguide";
    return "Dashboard";
  };

  const recentAlerts = activityLogs.slice(0, 4);

  return (
    <header className="bg-white border-b border-[#E4E4E7] px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Page Title Context — Zero Serif / Fraunces Removed */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#71717A]">
          <span>vine-and-clay</span>
          <span>/</span>
          <span className="text-[#18181B] font-medium">{getPagePath(pathname)}</span>
        </div>
        <h2 className="font-sans text-xl font-bold text-[#18181B] tracking-tight mt-0.5">
          {getSingleWordTitle()}
        </h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Realtime Connection Status Indicator */}
        <button
          onClick={toggleRealtime}
          className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono border transition-all ${
            isRealtimeEnabled
              ? "bg-[#F0FDF4] border-[#DCFCE7] text-[#16A34A]"
              : "bg-[#FEF2F2] border-[#FEE2E2] text-[#DC2626]"
          }`}
          title="Database Sync Status"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isRealtimeEnabled ? "bg-[#16A34A]" : "bg-[#DC2626] animate-pulse"
            }`}
          />
          <span className="font-medium text-[11px]">
            {isRealtimeEnabled ? "Live Sync (Active)" : "Sync Paused"}
          </span>
        </button>

        {/* Live Simulation Action */}
        <button
          onClick={simulateIncomingOrder}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-[#FFF4F0] hover:bg-[#FFDDD2] text-[#E05628] border border-[#FFDDD2] transition-colors"
          title="Simulate live incoming order event"
        >
          <Zap className="w-3.5 h-3.5 text-[#E05628]" />
          <span className="hidden sm:inline">+ Live Test</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 rounded-md text-[#71717A] hover:text-[#18181B] hover:bg-[#FAFAFA] border border-[#E4E4E7] relative transition-colors"
            title="Activity Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#E05628] absolute top-1 right-1" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E4E4E7] rounded-lg shadow-lg py-2 z-40">
              <div className="px-3 py-2 border-b border-[#E4E4E7] flex items-center justify-between">
                <span className="text-xs font-bold text-[#18181B]">Recent Activity & Alerts</span>
                <span className="text-[10px] font-mono text-[#71717A]">{activityLogs.length} events</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#E4E4E7]">
                {recentAlerts.map((log) => (
                  <div key={log.id} className="p-3 hover:bg-[#FAFAFA] transition-colors">
                    <p className="text-xs font-semibold text-[#18181B]">{log.action}</p>
                    <p className="text-[11px] text-[#71717A] mt-0.5">{log.details}</p>
                    <span className="text-[10px] font-mono text-[#71717A] mt-1 block">
                      {mounted ? formatTime(log.timestamp) : "..."} • {log.userName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Avatar & Role Selector */}
        <div className="flex items-center gap-1.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-md p-1">
          <Shield className="w-3.5 h-3.5 text-[#16A34A] ml-1 shrink-0" />
          <span className="text-[10px] font-mono text-[#71717A] font-medium hidden md:inline">Role:</span>
          {(["owner", "manager", "staff"] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setCurrentRole(r)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono capitalize transition-all ${
                currentRole === r
                  ? "bg-[#18181B] text-white font-semibold shadow-2xs"
                  : "text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function getPagePath(pathname: string) {
  if (pathname === "/admin") return "admin / dashboard";
  return pathname.replace("/", "").replaceAll("/", " / ");
}
