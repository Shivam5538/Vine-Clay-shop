"use client";

import React, { useState, useEffect } from "react";
import { useAdminStore } from "@/features/admin/store/useAdminStore";
import { formatDateTime } from "@/lib/format-date";
import { getModuleColor } from "@/features/admin/lib/colorMap";
import { StatCard } from "@/features/admin/components/StatCard";
import {
  Settings,
  Plus,
  Trash2,
  AlertTriangle,
  Users,
  ShieldCheck,
  Activity,
  UserCheck,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    staffUsers,
    setInviteStaffOpen,
    activityLogs,
    locations,
    currentRole,
    addToast,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<"staff" | "profile" | "notifications" | "audit">("staff");
  
  const activeUser = staffUsers.find(u => u.role === currentRole);
  const [profileName, setProfileName] = useState(activeUser?.name || "");
  const [profileEmail, setProfileEmail] = useState(activeUser?.email || "");

  useEffect(() => {
    if (activeUser) {
      setProfileName(activeUser.name);
      setProfileEmail(activeUser.email);
    }
  }, [activeUser]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeUser) {
      useAdminStore.getState().updateStaffUser(activeUser.id, {
        name: profileName,
        email: profileEmail
      });
      addToast({
        type: "success",
        title: "Profile Updated",
        description: "Your profile details have been saved successfully."
      });
    }
  };

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  // Destructive Modal State
  const [staffToRemove, setStaffToRemove] = useState<{ id: string; name: string } | null>(null);

  const colorConfig = getModuleColor("settings");

  const activeStaffCount = staffUsers.filter((u) => u.active).length;

  const handleConfirmRemoveStaff = () => {
    if (!staffToRemove) return;
    addToast({
      type: "info",
      title: "Staff Access Revoked",
      description: `Access for ${staffToRemove.name} has been revoked across all location terminals.`,
    });
    setStaffToRemove(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-8">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-lg ${colorConfig.bgSolid} text-white flex items-center justify-center shrink-0 shadow-xs`}
          >
            <Settings className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Settings & Staff Management
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Manage staff permissions, notification webhooks, system audit trail, and role access
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setInviteStaffOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Invite Staff</span>
          </button>
        </div>
      </div>

      {/* Module Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Staff Accounts"
          value={staffUsers.length}
          icon={Users}
          bgSolid={colorConfig.bgSolid}
          subtext="Configured roles"
        />
        <StatCard
          label="Active Terminals"
          value={activeStaffCount}
          icon={UserCheck}
          bgSolid="bg-emerald-600"
          subtext="Authorized staff"
        />
        <StatCard
          label="Security Protocol"
          value="RLS Enabled"
          icon={ShieldCheck}
          bgSolid="bg-blue-600"
          subtext="Supabase Postgres policies"
        />
        <StatCard
          label="Audit Events"
          value={activityLogs.length}
          icon={Activity}
          bgSolid="bg-purple-600"
          subtext="Logged in system trail"
        />
      </div>

      {/* Sub-tab Navigation */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-100/80 border border-slate-200/60 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("staff")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "staff"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Staff Accounts ({staffUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "notifications"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Notification Rules
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "audit"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Audit Trail ({activityLogs.length})
          </button>
        </div>
      </div>

      {activeTab === "staff" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-mono font-bold text-xs text-slate-900 uppercase tracking-wider">
                Staff User Directory ({staffUsers.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Role permissions enforced via Supabase RLS security policies.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Staff Member</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Assigned Sites</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-900">
                  {staffUsers.map((user) => {
                    const locNames = user.assignedLocationIds
                      .map((id) => locations.find((l) => l.id === id)?.name || id)
                      .join(", ");

                    return (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs uppercase shrink-0">
                            {user.name.slice(0, 2)}
                          </div>
                          {user.name}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{user.email}</td>
                        <td className="py-3.5 px-4 font-mono uppercase font-semibold text-[11px]">
                          <span
                            className={`px-2.5 py-0.5 rounded-full border ${
                              user.role === "owner"
                                ? "bg-amber-50 text-amber-700 border-amber-200 font-bold"
                                : user.role === "manager"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-500 truncate max-w-xs">
                          {locNames}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-semibold text-emerald-600">
                          ● Active
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono">
                          {user.role !== "owner" && (
                            <button
                              onClick={() => setStaffToRemove({ id: user.id, name: user.name })}
                              className="text-red-600 hover:text-red-700 text-xs font-semibold hover:underline flex items-center gap-1 ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Revoke</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-6 max-w-2xl">
          <h3 className="font-mono font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            My Profile Settings
          </h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
              <input 
                type="text" 
                value={activeUser?.role.toUpperCase()}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 font-mono"
                disabled
              />
              <p className="text-[10px] text-slate-400 mt-1">Role changes must be requested from the system administrator.</p>
            </div>
            <div className="pt-2">
              <button 
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-all shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-6 max-w-2xl">
          <h3 className="font-mono font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Notification Rules & Gateway Settings
          </h3>

          <div className="space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <div>
                <span className="font-bold text-slate-900 block">Email Alerts for Incoming Bookings</span>
                <span className="text-slate-500 text-[11px] mt-0.5 block">Dispatches immediate confirmation email to guest and floor manager</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-slate-900 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <div>
                <span className="font-bold text-slate-900 block">SMS Ready Notification for Counter Pickup</span>
                <span className="text-slate-500 text-[11px] mt-0.5 block">Sends automated SMS to customer phone when order status moves to Ready</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 accent-slate-900 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-4">
          <h3 className="font-mono font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Append-Only System Audit Log
          </h3>

          <div className="space-y-2.5">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">{log.userName}</span>
                  <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full uppercase">
                    {log.userRole}
                  </span>
                  <span className="text-blue-600 font-bold">{log.action}</span>
                  <span className="text-slate-500 font-sans">{log.details}</span>
                </div>

                <span className="text-slate-400 text-[11px] tabular-nums">
                  {mounted ? formatDateTime(log.timestamp) : "..."}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Destructive Action Modal */}
      {staffToRemove && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-red-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Revoke Staff Privileges</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Are you sure you want to revoke access for <strong className="text-slate-900">{staffToRemove.name}</strong>?
                </p>
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 leading-relaxed font-sans">
                  <strong>Consequence:</strong> This will revoke {staffToRemove.name}&apos;s access to all location POS terminals, order dispatch queues, and customer records immediately.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setStaffToRemove(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Cancel Keep Access
              </button>
              <button
                onClick={handleConfirmRemoveStaff}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Confirm Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
