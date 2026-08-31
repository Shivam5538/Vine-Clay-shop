"use client";

import React from "react";
import { AdminBooking, AdminTable } from "@/features/admin/types/admin";
import { formatTime } from "@/lib/format-date";
import { BookingStatusBadge } from "@/features/admin/components/StatusBadge";
import { useAdminStore } from "@/features/admin/store/useAdminStore";
import { Clock, User, Armchair, Sunrise, Sun, Coffee, Moon } from "lucide-react";

interface AgendaViewProps {
  bookings: AdminBooking[];
  tables: AdminTable[];
}

type TimeGroup = "Morning" | "Lunch" | "Afternoon" | "Dinner";

export function AgendaView({ bookings, tables }: AgendaViewProps) {
  const { setSelectedBookingId, updateBookingStatus } = useAdminStore();

  // Sort bookings chronologically
  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );

  // Grouping logic
  const groupedBookings: Record<TimeGroup, AdminBooking[]> = {
    Morning: [],
    Lunch: [],
    Afternoon: [],
    Dinner: [],
  };

  sortedBookings.forEach(booking => {
    const d = new Date(booking.dateTime);
    const hour = d.getHours();
    const minutes = d.getMinutes();
    const timeValue = hour + minutes / 60;

    if (timeValue < 11.5) {
      groupedBookings.Morning.push(booking);
    } else if (timeValue < 14.5) {
      groupedBookings.Lunch.push(booking);
    } else if (timeValue < 17) {
      groupedBookings.Afternoon.push(booking);
    } else {
      groupedBookings.Dinner.push(booking);
    }
  });

  const getTableName = (tableId?: string) => {
    if (!tableId) return "Unassigned";
    const table = tables.find(t => t.id === tableId);
    return table ? table.number : "Unassigned";
  };

  const sections: { title: TimeGroup; icon: React.ElementType; items: AdminBooking[], subtitle: string }[] = [
    { title: "Morning", icon: Sunrise, items: groupedBookings.Morning, subtitle: "Before 11:30 AM" },
    { title: "Lunch", icon: Sun, items: groupedBookings.Lunch, subtitle: "11:30 AM — 2:30 PM" },
    { title: "Afternoon", icon: Coffee, items: groupedBookings.Afternoon, subtitle: "2:30 PM — 5:00 PM" },
    { title: "Dinner", icon: Moon, items: groupedBookings.Dinner, subtitle: "After 5:00 PM" },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-900">Agenda View</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Chronological list of today&apos;s reservations</p>
        </div>
        <div className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
          {bookings.length} Total
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8 h-[600px] overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={section.title} className={idx !== 0 ? "pt-2" : ""}>
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <section.icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{section.title}</h4>
                <p className="text-[11px] text-slate-500 font-mono">{section.subtitle}</p>
              </div>
              <div className="ml-auto text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                {section.items.length} {section.items.length === 1 ? 'booking' : 'bookings'}
              </div>
            </div>

            {/* Section Bookings */}
            {section.items.length === 0 ? (
              <div className="ml-11 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-400 text-xs font-medium italic flex items-center">
                No reservations scheduled for {section.title.toLowerCase()}.
              </div>
            ) : (
              <div className="ml-11 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map(b => (
                  <div 
                    key={b.id} 
                    onClick={() => setSelectedBookingId(b.id)}
                    className="group bg-white border border-slate-100 hover:border-purple-200 rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col gap-3"
                  >
                    {/* Top Row: Time & Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5 text-purple-700 bg-purple-50 px-2 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold font-mono">{formatTime(b.dateTime)}</span>
                      </div>
                      <BookingStatusBadge status={b.status} />
                    </div>

                    {/* Middle: Customer Details */}
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm group-hover:text-purple-700 transition-colors">
                        {b.customerName}
                      </h5>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {b.partySize} Guests
                        </span>
                        <span className="flex items-center gap-1">
                          <Armchair className="w-3.5 h-3.5 text-slate-400" />
                          Table {getTableName(b.tableId)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom: Action Buttons */}
                    <div className="pt-3 mt-auto border-t border-slate-100 flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {b.status === "pending" && (
                        <button 
                          onClick={() => updateBookingStatus(b.id, "confirmed")}
                          className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {b.status === "confirmed" && (
                        <button 
                          onClick={() => updateBookingStatus(b.id, "seated")}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors"
                        >
                          Seat
                        </button>
                      )}
                      {b.status === "seated" && (
                        <button 
                          onClick={() => updateBookingStatus(b.id, "completed")}
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold rounded-lg transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      <button 
                        onClick={() => setSelectedBookingId(b.id)}
                        className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-bold rounded-lg transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
