"use client";

import React, { useState, useEffect } from "react";
import { useAdminStore } from "@/features/admin/store/useAdminStore";
import { BookingStatusBadge } from "@/features/admin/components/StatusBadge";
import { formatTime } from "@/lib/format-date";
import { getModuleColor } from "@/features/admin/lib/colorMap";
import { StatCard } from "@/features/admin/components/StatCard";
import { DateNavigator } from "@/features/admin/components/DateNavigator";

import { AgendaView } from "@/features/admin/components/AgendaView";
import { AdminTable, AdminBooking } from "@/features/admin/types/admin";
import {
  CalendarDays,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  LayoutGrid,
  Sparkles,
  ChevronRight,
  AlertCircle,
  MapPin,
} from "lucide-react";

export default function AdminBookingsPage() {
  const {
    bookings,
    tables,
    activeLocationId,
    locations,
    isLoaded,
    setNewBookingOpen,
    addTable,
    toggleTableActive,
    updateBookingStatus,
    currentRole,
    addToast,
    setSelectedBookingId,
  } = useAdminStore();

  const [mounted, setMounted] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [nowTime, setNowTime] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    const today = new Date();
    setSelectedDate(today.toISOString().split("T")[0]);
    setNowTime(today);

    const interval = setInterval(() => {
      setNowTime(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // New Table Form
  const [newTableNum, setNewTableNum] = useState("");
  const [newTableSeats, setNewTableSeats] = useState(4);
  const [newTableOutdoor, setNewTableOutdoor] = useState(false);

  // Filter tables & bookings by active location scope
  const filteredTables = tables.filter(
    (t) => activeLocationId === "all" || t.locationId === activeLocationId
  );

  const filteredBookings = bookings.filter(
    (b) => activeLocationId === "all" || b.locationId === activeLocationId
  );

  // Operating Hours Span (08:00 to 20:00 = 12 Hours = 720 Mins)
  const START_HOUR = 8;
  const END_HOUR = 20;
  const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60; // 720 mins

  const hoursArray = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole === "staff") {
      addToast({
        type: "error",
        title: "Permission Denied",
        description: "Staff members cannot add or modify physical tables.",
      });
      return;
    }

    if (!newTableNum) return;
    const locId = activeLocationId === "all" ? locations[0]?.id || "loc-downtown" : activeLocationId;

    addTable({
      locationId: locId,
      number: newTableNum.startsWith("T-") || newTableNum.startsWith("P-") || newTableNum.startsWith("K-") ? newTableNum : `T-${newTableNum}`,
      seatCount: Number(newTableSeats),
      isOutdoor: newTableOutdoor,
      active: true,
    });

    setNewTableNum("");
    setNewTableSeats(4);
    setNewTableOutdoor(false);
  };

  if (!mounted || !isLoaded) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 font-sans">
        <div className="flex justify-between border-b border-slate-200 pb-2">
          <div>
            <div className="h-3 w-32 bg-slate-200 rounded animate-pulse mb-1" />
            <div className="h-8 w-40 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-64 bg-white border border-slate-200 rounded-2xl animate-pulse p-6 flex items-center justify-center text-xs font-mono text-slate-400">
          Loading reservations...
        </div>
      </div>
    );
  }

  const colorConfig = getModuleColor("bookings");

  const confirmedCount = filteredBookings.filter((b) => b.status === "confirmed").length;
  const seatedCount = filteredBookings.filter((b) => b.status === "seated").length;
  const pendingBookings = filteredBookings.filter((b) => b.status === "pending");
  const pendingCount = pendingBookings.length;

  // Filter bookings for the selected timeline date
  const dateBookings = filteredBookings.filter((b) => {
    if (!selectedDate) return true;
    const bDateStr = b.dateTime.split("T")[0];
    return bDateStr === selectedDate;
  });

  // Calculate NOW line position %
  const todayStr = new Date().toISOString().split("T")[0];
  const isViewingToday = selectedDate === todayStr;
  let nowLinePercent: number | null = null;

  if (isViewingToday && nowTime) {
    const currentMins = nowTime.getHours() * 60 + nowTime.getMinutes();
    const startMins = START_HOUR * 60;
    const endMins = END_HOUR * 60;
    if (currentMins >= startMins && currentMins <= endMins) {
      nowLinePercent = ((currentMins - startMins) / TOTAL_MINUTES) * 100;
    }
  }

  // Table Grouping by Zone
  const indoorTables = filteredTables.filter((t) => !t.isOutdoor && !t.number.startsWith("K-"));
  const patioTables = filteredTables.filter((t) => t.isOutdoor);
  const kilnTables = filteredTables.filter((t) => t.number.startsWith("K-"));

  const tableGroups = [
    { zoneName: "INDOOR DINING", icon: LayoutGrid, tables: indoorTables },
    { zoneName: "OUTDOOR PATIO", icon: Sparkles, tables: patioTables },
    { zoneName: "BROOKLYN KILN ROOM", icon: MapPin, tables: kilnTables },
  ].filter((group) => group.tables.length > 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-8">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-lg ${colorConfig.bgSolid} text-white flex items-center justify-center shrink-0 shadow-xs`}
          >
            <CalendarDays className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Table Bookings & Floor Plan
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Manage seat reservations, Gantt timeline slots, and floor capacity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNewBookingOpen(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Module Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Bookings"
          value={filteredBookings.length}
          icon={CalendarDays}
          bgSolid={colorConfig.bgSolid}
          subtext="Total shift reservations"
        />
        <StatCard
          label="Seated Guests"
          value={seatedCount}
          icon={Users}
          bgSolid="bg-emerald-600"
          delta={seatedCount > 0 ? "Dining now" : undefined}
          subtext="Occupied tables"
        />
        <StatCard
          label="Confirmed Slots"
          value={confirmedCount}
          icon={CheckCircle2}
          bgSolid="bg-purple-600"
          subtext="Upcoming reservations"
        />
        <StatCard
          label="Pending Action"
          value={pendingCount}
          icon={AlertCircle}
          bgSolid="bg-amber-500"
          hasUnreadBadge={pendingCount > 0}
          subtext={pendingCount > 0 ? "Urgent confirmation" : "All reviewed"}
        />
      </div>

      {/* Primary Navigation Toolbar: Date Navigator */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1" />
        <DateNavigator
          selectedDate={selectedDate}
          onDateChange={(newDate) => setSelectedDate(newDate)}
        />
      </div>

      {/* View 1: Agenda View */}
      <div className="space-y-8">
          <AgendaView bookings={dateBookings} tables={filteredTables} />

          {/* Targeted Shift Queue: Needs Attention & Arriving Soon */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Needs Attention & Arriving Soon
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Action pending confirmations and guests arriving in current shift
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {pendingCount} Pending Action
              </span>
            </div>

            <div className="space-y-3">
              {filteredBookings.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                  No reservations for this shift view.
                </div>
              ) : (
                filteredBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 bg-slate-50/80 hover:bg-purple-50/40 border border-slate-200/70 hover:border-purple-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {booking.customerName.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 truncate">
                            {booking.customerName}
                          </span>
                          <span className="font-mono text-xs text-purple-600 font-bold">
                            #{booking.bookingRef}
                          </span>
                          <BookingStatusBadge status={booking.status} />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          {booking.partySize} Guests · Table {booking.tableName || "T-01"} · {formatTime(booking.dateTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      {booking.status === "pending" && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, "confirmed")}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
                        >
                          Confirm Slot
                        </button>
                      )}
                      {booking.status === "confirmed" && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, "seated")}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
                        >
                          Seat Guests
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedBookingId(booking.id)}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
