"use client";

import React, { useState } from "react";
import { useAdminStore } from "@/features/admin/store/useAdminStore";
import { getModuleColor } from "@/features/admin/lib/colorMap";
import { StatCard } from "@/features/admin/components/StatCard";
import {
  Users,
  Search,
  Award,
  Phone,
  Mail,
  DollarSign,
  CalendarCheck,
  Plus,
  ChevronRight,
} from "lucide-react";
import { CustomerSidePanel } from "@/features/admin/components/CustomerSidePanel";

export default function AdminCustomersPage() {
  const { customers, orders, bookings, setSelectedCustomerId, addCustomer } = useAdminStore();
  const [localFilter, setLocalFilter] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "vip" | "gold" | "silver">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Guest Form State
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestEmail, setNewGuestEmail] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const [newGuestVip, setNewGuestVip] = useState(false);

  const colorConfig = getModuleColor("customers");

  // Dynamic customer records compiled from database customers + orders & bookings
  const compiledCustomers = customers.map((cust) => {
    const custOrders = orders.filter(
      (o) =>
        (cust.email && o.customerEmail?.toLowerCase() === cust.email.toLowerCase()) ||
        (cust.phone && o.customerPhone === cust.phone) ||
        o.customerName.toLowerCase() === cust.name.toLowerCase()
    );

    const custBookings = bookings.filter(
      (b) =>
        (cust.email && b.customerEmail.toLowerCase() === cust.email.toLowerCase()) ||
        (cust.phone && b.customerPhone === cust.phone) ||
        b.customerName.toLowerCase() === cust.name.toLowerCase()
    );

    const totalOrdersCount = Math.max(cust.totalOrders, custOrders.length);
    const totalBookingsCount = Math.max(cust.totalBookings, custBookings.length);
    const totalSpentCalculated = Math.max(
      cust.totalSpent,
      custOrders.reduce((sum, o) => sum + o.total, 0)
    );

    return {
      ...cust,
      totalOrders: totalOrdersCount,
      totalBookings: totalBookingsCount,
      totalSpent: totalSpentCalculated,
    };
  });

  const vipCount = compiledCustomers.filter((c) => c.vipStatus).length;
  const totalSpentAll = compiledCustomers.reduce((sum, c) => sum + c.totalSpent, 0);

  const filteredCustomers = compiledCustomers.filter((c) => {
    // Search Filter
    const q = localFilter.toLowerCase().trim();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q);

    if (!matchSearch) return false;

    // Tab Filter
    if (filterTab === "vip") return c.vipStatus;
    if (filterTab === "gold") return c.totalSpent >= 300;
    if (filterTab === "silver") return c.totalSpent < 300;

    return true;
  });

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName || !newGuestEmail) return;

    addCustomer({
      name: newGuestName,
      email: newGuestEmail,
      phone: newGuestPhone || "(555) 000-0000",
      vipStatus: newGuestVip,
    });

    setNewGuestName("");
    setNewGuestEmail("");
    setNewGuestPhone("");
    setNewGuestVip(false);
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-8">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-lg ${colorConfig.bgSolid} text-white flex items-center justify-center shrink-0 shadow-xs`}
          >
            <Users className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Customer Directory & VIP Profiles
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Review guest contact records, lifetime order history, table bookings, and VIP perks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Guest Profile</span>
          </button>
        </div>
      </div>

      {/* Module Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Registered Guests"
          value={compiledCustomers.length}
          icon={Users}
          bgSolid={colorConfig.bgSolid}
          subtext="Total customer profiles"
        />
        <StatCard
          label="VIP Patrons"
          value={vipCount}
          icon={Award}
          bgSolid="bg-amber-500"
          delta={vipCount > 0 ? "High Value" : undefined}
          subtext="Priority seating guests"
        />
        <StatCard
          label="Total Patron Spend"
          value={`$${totalSpentAll.toFixed(0)}`}
          icon={DollarSign}
          bgSolid="bg-emerald-600"
          subtext="Lifetime cafe & studio sales"
        />
        <StatCard
          label="Total Reservations"
          value={compiledCustomers.reduce((sum, c) => sum + c.totalBookings, 0)}
          icon={CalendarCheck}
          bgSolid="bg-purple-600"
          subtext="Fulfilled table slots"
        />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/80 border border-slate-200/60 rounded-lg p-1 overflow-x-auto">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all shrink-0 ${
              filterTab === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Guests ({compiledCustomers.length})
          </button>
          <button
            onClick={() => setFilterTab("vip")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all shrink-0 ${
              filterTab === "vip"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            VIP Guests ({vipCount})
          </button>
          <button
            onClick={() => setFilterTab("gold")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all shrink-0 ${
              filterTab === "gold"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Gold Tier ($300+)
          </button>
          <button
            onClick={() => setFilterTab("silver")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all shrink-0 ${
              filterTab === "silver"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Silver Tier (&lt;$300)
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search guest by name, email, phone..."
            value={localFilter}
            onChange={(e) => setLocalFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:border-sky-500 shadow-xs"
          />
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Guest Records (Click row to view history & manage VIP status)
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {filteredCustomers.length} results
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-mono text-slate-500 uppercase tracking-wider sticky top-0">
              <tr>
                <th className="py-3.5 px-4">Guest Profile</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4 text-right">Orders</th>
                <th className="py-3.5 px-4 text-right">Bookings</th>
                <th className="py-3.5 px-4 text-right">Lifetime Spend</th>
                <th className="py-3.5 px-4 text-right">Last Visit</th>
                <th className="py-3.5 px-4 text-center">Patron Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-mono">
                    No guest profiles found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className="hover:bg-sky-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs uppercase shrink-0">
                          {cust.name.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-slate-900 block group-hover:text-sky-600 transition-colors">
                            {cust.name}
                          </span>
                          {cust.vipStatus && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 font-bold">
                              <Award className="w-3 h-3" /> VIP Guest
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      <div className="flex items-center gap-1.5 text-xs text-slate-900 tabular-nums">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {cust.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {cust.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {cust.totalOrders}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {cust.totalBookings}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-sky-600 tabular-nums">
                      ${cust.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500 tabular-nums">
                      {cust.lastVisit}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-sky-50 border border-sky-200 text-sky-700 rounded-full text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                        {cust.totalSpent >= 300 ? "Gold Tier" : "Silver Tier"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs">
                      <span className="text-sky-600 font-semibold group-hover:underline flex items-center gap-1 justify-end">
                        <span>Profile</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Guest Profile Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Add Guest Profile
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGuest} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Guest Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Patel"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ananya@example.com"
                  value={newGuestEmail}
                  onChange={(e) => setNewGuestEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Phone Contact
                </label>
                <input
                  type="text"
                  placeholder="e.g. (917) 555-0188"
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50/60 border border-amber-100 rounded-xl">
                <input
                  type="checkbox"
                  id="vipToggle"
                  checked={newGuestVip}
                  onChange={(e) => setNewGuestVip(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
                <label htmlFor="vipToggle" className="text-slate-800 font-semibold cursor-pointer">
                  Mark as VIP Patron (Priority seating & perks)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Detail Drawer */}
      <CustomerSidePanel />
    </div>
  );
}
