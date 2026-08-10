"use client";

import React, { useState, useEffect } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { BookingStatusBadge } from "./StatusBadge";
import { formatDateTime, formatTime } from "@/lib/format-date";
import {
  X,
  User,
  Phone,
  Mail,
  Clock,
  Users,
  Armchair,
  AlertCircle,
  ChevronRight,
  RotateCcw,
  MapPin,
} from "lucide-react";
import { BookingStatus } from "../types/admin";

export function BookingSidePanel() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    bookings,
    tables,
    locations,
    selectedBookingId,
    setSelectedBookingId,
    updateBookingStatus,
    activityLogs,
  } = useAdminStore();

  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!selectedBookingId) return null;

  const booking = bookings.find((b) => b.id === selectedBookingId);
  if (!booking) return null;

  const assignedLocation = locations.find((l) => l.id === booking.locationId);
  const assignedTable = tables.find((t) => t.id === booking.tableId);

  const nextStatusMap: Record<BookingStatus, BookingStatus | null> = {
    pending: "confirmed",
    confirmed: "seated",
    seated: "completed",
    completed: null,
    cancelled: null,
    no_show: null,
  };

  const nextStatus = nextStatusMap[booking.status];

  const handleAdvance = () => {
    if (nextStatus) {
      updateBookingStatus(booking.id, nextStatus);
    }
  };

  const handleConfirmCancel = () => {
    updateBookingStatus(booking.id, "cancelled");
    setShowCancelModal(false);
  };

  const bookingLogs = activityLogs.filter(
    (l) => l.entityType === "booking" && l.entityId === booking.id
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#33241A]/40 backdrop-blur-xs transition-opacity duration-200 ease-out"
      onClick={() => setSelectedBookingId(null)}
    >
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col font-sans border-l border-[#E8DFD5] animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-[#E8DFD5] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-lg text-[#C1633B]">
              {booking.bookingRef}
            </span>
            <BookingStatusBadge status={booking.status} />
            <span className="text-xs font-mono text-[#8C7B6E] bg-white border border-[#E8DFD5] px-2 py-0.5 rounded">
              {booking.source.toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => setSelectedBookingId(null)}
            className="p-1.5 text-[#8C7B6E] hover:text-[#33241A] hover:bg-[#FBF6EF] rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-[#FAF8F5] border-b border-[#E8DFD5] flex items-center justify-between gap-3">
          {nextStatus ? (
            <button
              onClick={handleAdvance}
              className="flex-1 bg-[#C1633B] hover:bg-[#a9532f] text-white py-2.5 px-4 rounded-md text-xs font-semibold font-mono flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>Advance Status to</span>
              <span className="uppercase font-bold underline decoration-white/40">{nextStatus}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-[#6B7548] bg-[#FAF8F5] px-3 py-2 rounded-md border border-[#6B7548]/30 flex-1">
              <span className="w-2 h-2 rounded-full bg-[#6B7548]" />
              <span>Reservation reached terminal status ({booking.status.toUpperCase()}).</span>
            </div>
          )}

          {booking.status !== "completed" && booking.status !== "cancelled" && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-3 py-2.5 text-xs font-mono text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors font-medium flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cancel Reservation</span>
            </button>
          )}
        </div>

        {/* Scrollable Detail Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Guest Contact & Party Summary */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#FAF8F5] border border-[#E8DFD5] rounded-md">
            <div>
              <span className="text-[10px] font-mono text-[#8C7B6E] uppercase tracking-wider block mb-1">
                Guest Profile
              </span>
              <p className="text-sm font-semibold text-[#33241A] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C1633B]" />
                {booking.customerName}
              </p>
              <p className="text-xs font-mono text-[#66584C] flex items-center gap-1.5 mt-1 tabular-nums">
                <Phone className="w-3.5 h-3.5 text-[#8C7B6E]" />
                {booking.customerPhone || "No phone provided"}
              </p>
              {booking.customerEmail && (
                <p className="text-xs font-mono text-[#66584C] flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#8C7B6E]" />
                  {booking.customerEmail}
                </p>
              )}
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#8C7B6E] uppercase tracking-wider block mb-1">
                Seating & Schedule
              </span>
              <p className="text-xs font-mono text-[#33241A] font-semibold flex items-center gap-1.5 tabular-nums">
                <Users className="w-3.5 h-3.5 text-[#6B7548]" />
                Party of {booking.partySize} Guests
              </p>
              <p className="text-xs font-mono text-[#66584C] flex items-center gap-1.5 mt-1 tabular-nums">
                <Clock className="w-3.5 h-3.5 text-[#8C7B6E]" />
                {mounted ? formatDateTime(booking.dateTime) : "..."} ({booking.durationMinutes} min)
              </p>
              <p className="text-xs font-mono text-[#66584C] flex items-center gap-1.5 mt-0.5">
                <Armchair className="w-3.5 h-3.5 text-[#8C7B6E]" />
                Table: <strong>{assignedTable?.number || booking.tableName || "Auto-Assigned"}</strong>
              </p>
            </div>
          </div>

          {/* Location Assignment */}
          <div className="p-3.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-md flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C1633B]" />
              <div>
                <span className="font-semibold text-[#33241A] block">{assignedLocation?.name || "Flagship Studio"}</span>
                <span className="text-[11px] font-mono text-[#8C7B6E]">{assignedLocation?.address}</span>
              </div>
            </div>
          </div>

          {/* Special Requests / Notes Banner */}
          {booking.specialRequests && (
            <div className="p-3 bg-[#FBF6EF] border border-[#C1633B]/30 rounded-md flex items-start gap-2 text-xs text-[#33241A]">
              <AlertCircle className="w-4 h-4 text-[#C1633B] shrink-0 mt-0.5" />
              <div>
                <span className="font-mono font-bold uppercase tracking-wider block text-[10px] text-[#C1633B]">
                  Special Request / Seating Note:
                </span>
                <p className="mt-0.5 font-sans font-medium">{booking.specialRequests}</p>
              </div>
            </div>
          )}

          {/* Activity Log Trail */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#8C7B6E] font-semibold">
              Reservation Activity Audit Log ({bookingLogs.length})
            </h4>
            {bookingLogs.length === 0 ? (
              <p className="text-xs font-mono text-[#8C7B6E] italic bg-[#FAF8F5] p-3 rounded border border-[#E8DFD5]">
                No status changes logged for this booking yet.
              </p>
            ) : (
              <div className="border border-[#E8DFD5] rounded-md divide-y divide-[#E8DFD5] bg-[#FAF8F5]">
                {bookingLogs.map((log) => (
                  <div key={log.id} className="p-2.5 text-xs font-mono flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#33241A]">{log.action}</span>
                      <span className="text-[#8C7B6E] block text-[11px]">{log.details}</span>
                    </div>
                    <span className="text-[10px] text-[#8C7B6E] shrink-0">
                      {mounted ? formatTime(log.timestamp) : "..."}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cancellation Confirmation Overlay Modal */}
        {showCancelModal && (
          <div className="absolute inset-0 z-50 bg-[#33241A]/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-5 max-w-sm w-full space-y-4 shadow-xl border border-[#E8DFD5]">
              <div className="flex items-center gap-2 text-[#DC2626]">
                <AlertCircle className="w-5 h-5" />
                <h4 className="font-sans font-bold text-base text-[#18181B]">Cancel Reservation?</h4>
              </div>
              <p className="text-xs text-[#66584C]">
                Are you sure you want to mark reservation <strong>#{booking.bookingRef}</strong> for {booking.customerName} as cancelled?
              </p>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8DFD5]">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-3 py-1.5 text-xs font-mono bg-[#FAF8F5] border border-[#E8DFD5] rounded text-[#33241A]"
                >
                  Keep Reservation
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-3 py-1.5 text-xs font-mono bg-red-700 hover:bg-red-800 text-white rounded font-bold"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
