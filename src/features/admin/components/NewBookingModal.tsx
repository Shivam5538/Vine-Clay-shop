"use client";

import React, { useState, useEffect } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { createBookingAction } from "../actions/bookingActions";
import { X, User, Mail, Phone, Calendar, Clock, Users, MapPin } from "lucide-react";
import { BookingSource } from "../types/admin";

export function NewBookingModal() {
  const { isNewBookingOpen, setNewBookingOpen, locations, activeLocationId, tables, createBooking, addBookingToStore } = useAdminStore();

  const [locationId, setLocationId] = useState(
    activeLocationId === "all" ? locations[0]?.id || "" : activeLocationId
  );
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState("2026-08-07");
  const [time, setTime] = useState("14:00");
  const [tableId, setTableId] = useState("");
  const [source, setSource] = useState<BookingSource>("phone");
  const [specialRequests, setSpecialRequests] = useState("");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  if (!isNewBookingOpen) return null;

  const availableTables = tables.filter((t) => t.locationId === locationId && t.active);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName || !customerEmail || !customerPhone) {
      setErrorMessage("Please enter guest name, email, and phone number.");
      return;
    }

    const dateTimeIso = new Date(`${date}T${time}:00`).toISOString();

    // 1. Persist to Supabase database
    const serverResult = await createBookingAction({
      locationId,
      tableId: tableId || undefined,
      customerName,
      customerPhone,
      customerEmail,
      partySize: Number(partySize),
      dateTime: dateTimeIso,
      durationMinutes: 90,
      status: "confirmed",
      source,
      notes: specialRequests,
    });

    // 2. Also update local store for instant UI feedback
    const res = createBooking({
      locationId,
      customerName,
      customerEmail,
      customerPhone,
      partySize: Number(partySize),
      dateTime: dateTimeIso,
      durationMinutes: 90,
      status: "confirmed",
      source,
      tableId: tableId || undefined,
      specialRequests,
    });

    // If Supabase returned the real row, replace the optimistic store entry
    if (serverResult.success && serverResult.booking) {
      const b = serverResult.booking;
      addBookingToStore({
        id: b.id,
        bookingRef: b.booking_ref ?? `RES-${String(b.id).slice(0, 6)}`,
        locationId: b.location_id,
        tableId: b.table_id ?? undefined,
        customerName: b.customer_name,
        customerEmail: b.customer_email ?? "",
        customerPhone: b.customer_phone ?? "",
        partySize: b.party_size,
        dateTime: b.date_time,
        durationMinutes: b.duration_minutes ?? 90,
        status: b.status,
        source: b.source,
        specialRequests: b.special_requests ?? undefined,
        createdAt: b.created_at ?? new Date().toISOString(),
      });
    } else if (!res.success) {
      setErrorMessage(serverResult.error || res.message || "Failed to save reservation.");
      return;
    }

    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setSpecialRequests("");
    setErrorMessage("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#33241A]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-[#E8DFD5] overflow-hidden font-sans animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E4E4E7] bg-[#FAFAFA] flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold text-lg text-[#18181B]">New Reservation</h3>
            <p className="text-xs font-mono text-[#71717A]">Create table booking with automatic collision detection</p>
          </div>
          <button
            onClick={() => setNewBookingOpen(false)}
            className="p-1.5 text-[#8C7B6E] hover:text-[#33241A] hover:bg-[#FBF6EF] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 font-sans">
              <strong>Reservation Error:</strong> {errorMessage}
            </div>
          )}

          {/* Section 1: Location & Source */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8C7B6E] font-semibold border-b border-[#E8DFD5] pb-1">
              Section 1 — Location & Channel Scope
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#33241A] mb-1">
                  Location Site <span className="text-[#C1633B]">*</span>
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="admin-input w-full cursor-pointer"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#33241A] mb-1">
                  Booking Source <span className="text-[#C1633B]">*</span>
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as BookingSource)}
                  className="admin-input w-full cursor-pointer"
                >
                  <option value="phone">Phone Call</option>
                  <option value="walk_in">Walk-In Counter</option>
                  <option value="online">Online Web</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Guest Profile */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8C7B6E] font-semibold border-b border-[#E8DFD5] pb-1">
              Section 2 — Guest Contact Profile
            </h4>
            <div>
              <label className="block text-xs font-semibold text-[#33241A] mb-1">
                Guest Full Name <span className="text-[#C1633B]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Eleanor Vance"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="admin-input w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#33241A] mb-1">
                  Email Address <span className="text-[#C1633B]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="eleanor@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="admin-input w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#33241A] mb-1">
                  Phone Number <span className="text-[#C1633B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="(555) 019-2831"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="admin-input w-full font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Time & Party Details */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8C7B6E] font-semibold border-b border-[#E8DFD5] pb-1">
              Section 3 — Schedule & Seating Assignment
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#33241A] mb-1">
                  Date <span className="text-[#C1633B]">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="admin-input w-full font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#33241A] mb-1">
                  Time Slot <span className="text-[#C1633B]">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="admin-input w-full font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#33241A] mb-1">
                  Party Size <span className="text-[#C1633B]">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={16}
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  className="admin-input w-full font-mono text-xs font-bold"
                />
              </div>
            </div>

            {/* Optional / Advanced Details Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="text-xs font-mono text-[#C1633B] hover:underline flex items-center gap-1 font-medium"
              >
                <span>{showMoreOptions ? "— Hide optional preferences" : "+ Add table override or special notes"}</span>
              </button>

              {showMoreOptions && (
                <div className="space-y-3 pt-3 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-semibold text-[#33241A] mb-1">
                      Table Assignment Override
                    </label>
                    <select
                      value={tableId}
                      onChange={(e) => setTableId(e.target.value)}
                      className="admin-input w-full cursor-pointer"
                    >
                      <option value="">Auto-Assign Best Available Table</option>
                      {availableTables.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.number} ({t.seatCount} Seats — {t.isOutdoor ? "Patio" : "Indoor"})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#33241A] mb-1">
                      Special Requests / Dietary Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Anniversary celebration, quiet window table..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="admin-input w-full text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-[#E8DFD5] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewBookingOpen(false)}
              className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#FBF6EF] border border-[#E8DFD5] text-[#33241A] text-xs font-medium rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#C1633B] hover:bg-[#a9532f] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
            >
              Confirm Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

