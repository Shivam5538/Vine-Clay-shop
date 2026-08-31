"use client";

import React from "react";
import { useAdminStore } from "../store/useAdminStore";
import { formatTime } from "@/lib/format-date";
import {
  X,
  Award,
  Phone,
  Mail,
  ShoppingBag,
  CalendarDays,
  Star,
} from "lucide-react";

export function CustomerSidePanel() {
  const {
    selectedCustomerId,
    setSelectedCustomerId,
    customers,
    orders,
    bookings,
    toggleVipStatus,
    setSelectedOrderId,
    setSelectedBookingId,
  } = useAdminStore();

  if (!selectedCustomerId) return null;

  const customer = customers.find((c) => c.id === selectedCustomerId);
  if (!customer) return null;

  // Match orders & bookings for this customer by email, phone, or name
  const customerOrders = orders.filter(
    (o) =>
      (customer.email && o.customerEmail?.toLowerCase() === customer.email.toLowerCase()) ||
      (customer.phone && o.customerPhone === customer.phone) ||
      o.customerName.toLowerCase() === customer.name.toLowerCase()
  );

  const customerBookings = bookings.filter(
    (b) =>
      (customer.email && b.customerEmail.toLowerCase() === customer.email.toLowerCase()) ||
      (customer.phone && b.customerPhone === customer.phone) ||
      b.customerName.toLowerCase() === customer.name.toLowerCase()
  );

  const calculatedOrdersCount = Math.max(customer.totalOrders, customerOrders.length);
  const calculatedBookingsCount = Math.max(customer.totalBookings, customerBookings.length);
  const calculatedSpent = Math.max(
    customer.totalSpent,
    customerOrders.reduce((sum, o) => sum + o.total, 0)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setSelectedCustomerId(null)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-base uppercase shrink-0 shadow-xs">
                {customer.name.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    {customer.name}
                  </h2>
                  {customer.vipStatus && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      VIP
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Guest ID: {customer.id}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedCustomerId(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* VIP Status Action */}
            <div className="p-4 bg-sky-50/60 border border-sky-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-sky-900 block">
                  VIP Patron Status
                </span>
                <span className="text-[11px] text-sky-700 font-medium">
                  {customer.vipStatus
                    ? "Guest receives priority seating & complimentary tasters"
                    : "Upgrade guest to VIP status for perks"}
                </span>
              </div>

              <button
                onClick={() => toggleVipStatus(customer.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs shrink-0 ${
                  customer.vipStatus
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                {customer.vipStatus ? "VIP Active" : "Upgrade to VIP"}
              </button>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Contact Information
              </h3>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone:
                  </span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {customer.phone}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
                  </span>
                  <a
                    href={`mailto:${customer.email}`}
                    className="font-semibold text-sky-600 hover:underline truncate max-w-[200px]"
                  >
                    {customer.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Financial & Visit Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl font-mono">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                  Lifetime Spend
                </span>
                <span className="text-xl font-bold text-sky-600 tabular-nums">
                  ${calculatedSpent.toFixed(2)}
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl font-mono">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                  Patron Tier
                </span>
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1 mt-1">
                  <Award className="w-4 h-4 text-sky-600" />
                  {calculatedSpent > 300 ? "Gold Tier" : "Silver Tier"}
                </span>
              </div>
            </div>

            {/* Order History List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                  Order History ({customerOrders.length})
                </h3>
              </div>

              {customerOrders.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-400 font-mono">
                  No orders recorded for this profile yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {customerOrders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => {
                        setSelectedCustomerId(null);
                        setSelectedOrderId(ord.id);
                      }}
                      className="p-3 bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all"
                    >
                      <div>
                        <span className="font-mono font-bold text-blue-600">
                          {ord.orderNumber}
                        </span>
                        <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                          {ord.items.length} item{ord.items.length > 1 ? "s" : ""} • {ord.status.toUpperCase()}
                        </p>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-slate-900 block tabular-nums">
                          ${ord.total.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatTime(ord.receivedAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Table Reservation History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-purple-600" />
                  Table Reservations ({customerBookings.length})
                </h3>
              </div>

              {customerBookings.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-400 font-mono">
                  No reservations recorded for this profile yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {customerBookings.map((bk) => (
                    <div
                      key={bk.id}
                      onClick={() => {
                        setSelectedCustomerId(null);
                        setSelectedBookingId(bk.id);
                      }}
                      className="p-3 bg-purple-50/40 hover:bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all"
                    >
                      <div>
                        <span className="font-mono font-bold text-purple-700">
                          #{bk.bookingRef}
                        </span>
                        <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                          {bk.partySize} Guests • {bk.tableName || "T-01"}
                        </p>
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-purple-700 bg-white px-2 py-1 rounded-md border border-purple-200">
                        {formatTime(bk.dateTime)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
