"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAdminStore } from "@/features/admin/store/useAdminStore";
import { createBookingAction } from "@/features/admin/actions/bookingActions";
import type { BookingStatus as AdminBookingStatus, BookingSource as AdminBookingSource } from "@/features/admin/types/admin";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Users, Coffee, CheckCircle2, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { ReservationData } from "@/types";

export function ReservationModal() {
  const { isReservationOpen, closeReservation, setLastReservation, addToast } = useCartStore();

  const [formData, setFormData] = useState<ReservationData>({
    name: "",
    email: "",
    phone: "",
    guests: 2,
    date: "2026-08-07",
    time: "10:30",
    seatingPreference: "sunlit-patio",
    specialRequests: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: new Date().toISOString().split("T")[0],
    }));
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const timeSlots = ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const adminStore = useAdminStore.getState();
    const locationId =
      adminStore.activeLocationId === "all"
        ? adminStore.locations[0]?.id || "loc-downtown"
        : adminStore.activeLocationId;

    const dateTime = `${formData.date}T${formData.time}:00`;

    // Auto-assign suitable table if available
    const suitableTable = adminStore.tables.find(
      (t) =>
        t.locationId === locationId &&
        t.active &&
        t.seatCount >= Number(formData.guests)
    );

    const specialRequests = formData.seatingPreference
      ? `[Seating: ${formData.seatingPreference}] ${formData.specialRequests}`.trim()
      : formData.specialRequests;

    // 1. Invoke Server Action to persist in Supabase database
    const serverResult = await createBookingAction({
      locationId,
      tableId: suitableTable?.id,
      customerName: formData.name,
      customerPhone: formData.phone || "(555) 019-2831",
      customerEmail: formData.email,
      partySize: Number(formData.guests),
      dateTime,
      durationMinutes: 90,
      status: "confirmed",
      source: "online",
      notes: specialRequests,
    });

    setIsSubmitting(false);

    if (!serverResult.success || !serverResult.booking) {
      // DB failed — show the actual error, never fake success
      setErrorMessage(
        serverResult.error || "Failed to save reservation. Please try again."
      );
      return;
    }

    // DB succeeded — push the real Supabase row into the admin store
    const b = serverResult.booking;
    adminStore.addBookingToStore({
      id: b.id,
      bookingRef: b.booking_ref ?? `RES-${String(b.id).slice(0, 6)}`,
      locationId: b.location_id,
      tableId: b.table_id ?? undefined,
      tableName: suitableTable?.number ?? undefined,
      customerName: b.customer_name,
      customerEmail: b.customer_email ?? "",
      customerPhone: b.customer_phone ?? "",
      partySize: b.party_size,
      dateTime: b.date_time,
      durationMinutes: b.duration_minutes ?? 90,
      status: b.status as AdminBookingStatus,
      source: b.source as AdminBookingSource,
      specialRequests: b.special_requests ?? undefined,
      createdAt: b.created_at ?? new Date().toISOString(),
    });

    setConfirmed(true);
    setLastReservation(formData);
    addToast(`Table reserved for ${formData.name} on ${formData.date} at ${formData.time}`, "success");

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#C1633B", "#6B7548", "#D9BFA0"],
    });
  };


  const handleResetAndClose = () => {
    setConfirmed(false);
    closeReservation();
  };

  return (
    <AnimatePresence>
      {isReservationOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-[#33241A] z-50 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-lg bg-[#FBF6EF] text-[#33241A] rounded-3xl shadow-2xl overflow-hidden border border-[#D9BFA0]/40 my-8"
            >
              {/* Top Accent Band */}
              <div className="h-2 bg-[#C1633B] w-full" />

              {/* Close Button */}
              <button
                onClick={handleResetAndClose}
                className="absolute top-5 right-5 p-2 text-[#33241A]/60 hover:text-[#33241A] rounded-full hover:bg-[#33241A]/5 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {confirmed ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#6B7548]/15 text-[#6B7548] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-fraunces text-[#33241A]">Reservation Confirmed</h3>
                  <p className="text-sm text-[#33241A]/70 leading-relaxed max-w-sm mx-auto">
                    We look forward to welcoming you to Vine & Clay. A confirmation email has been sent to{" "}
                    <span className="font-semibold text-[#C1633B]">{formData.email}</span>.
                  </p>

                  <div className="p-4 bg-white rounded-2xl border border-[#D9BFA0]/40 text-left font-mono text-xs space-y-2 text-[#33241A]/80">
                    <div className="flex justify-between">
                      <span className="text-[#33241A]/50">Guest:</span>
                      <span className="font-medium">{formData.name} ({formData.guests} Guests)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#33241A]/50">Date & Time:</span>
                      <span className="font-medium">{formData.date} @ {formData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#33241A]/50">Seating Area:</span>
                      <span className="font-medium capitalize">{formData.seatingPreference.replace("-", " ")}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleResetAndClose}
                    className="w-full py-3.5 rounded-full bg-[#33241A] text-[#FBF6EF] font-medium text-sm hover:bg-[#211610] transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                  <div className="space-y-1">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#C1633B]">
                      Table Reservation
                    </span>
                    <h3 className="text-2xl font-fraunces text-[#33241A]">Reserve Your Moment</h3>
                    <p className="text-xs text-[#33241A]/60">
                      Join us for slow coffee, pastries, or a seat by the pottery wheel.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-900 font-mono">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#33241A]/80 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Elena Vance"
                        className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#D9BFA0]/50 text-sm focus:outline-none focus:border-[#C1633B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#33241A]/80 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="elena@example.com"
                        className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#D9BFA0]/50 text-sm focus:outline-none focus:border-[#C1633B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-[#33241A]/80 mb-1 flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#C1633B]" /> Guests
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 bg-white rounded-xl border border-[#D9BFA0]/50 text-sm focus:outline-none focus:border-[#C1633B]"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "Guest" : "Guests"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#33241A]/80 mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C1633B]" /> Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-2.5 py-2 bg-white rounded-xl border border-[#D9BFA0]/50 text-xs focus:outline-none focus:border-[#C1633B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#33241A]/80 mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C1633B]" /> Time
                      </label>
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white rounded-xl border border-[#D9BFA0]/50 text-sm focus:outline-none focus:border-[#C1633B]"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#33241A]/80 mb-1.5 flex items-center gap-1">
                      <Coffee className="w-3 h-3 text-[#6B7548]" /> Seating Atmosphere
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        { id: "sunlit-patio", label: "Sunlit Patio" },
                        { id: "main-hall", label: "Main Cafe Hall" },
                        { id: "ceramic-bench", label: "Studio Wheel Bench" },
                      ].map((area) => (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              seatingPreference: area.id as any,
                            })
                          }
                          className={`py-2 px-2.5 rounded-xl border text-center font-medium transition-all ${
                            formData.seatingPreference === area.id
                              ? "bg-[#C1633B] text-[#FBF6EF] border-[#C1633B]"
                              : "bg-white text-[#33241A]/80 border-[#D9BFA0]/50 hover:border-[#C1633B]"
                          }`}
                        >
                          {area.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-[#C1633B] hover:bg-[#a8522d] text-[#FBF6EF] font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-[#FBF6EF] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Confirm Table Reservation"
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
