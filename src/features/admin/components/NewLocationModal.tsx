"use client";

import React, { useState } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { X, Clock } from "lucide-react";
import { WeeklySchedule } from "../types/admin";

export function NewLocationModal() {
  const { isNewLocationOpen, setNewLocationOpen, saveLocation, currentRole, addToast } = useAdminStore();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [capacity, setCapacity] = useState(40);
  const [latitude, setLatitude] = useState(40.7241);
  const [longitude, setLongitude] = useState(-73.9982);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const [hours] = useState<WeeklySchedule>({
    monday: { open: "07:00", close: "18:00" },
    tuesday: { open: "07:00", close: "18:00" },
    wednesday: { open: "07:00", close: "18:00" },
    thursday: { open: "07:00", close: "19:00" },
    friday: { open: "07:00", close: "20:00" },
    saturday: { open: "08:00", close: "20:00" },
    sunday: { open: "08:00", close: "18:00" },
  });

  if (!isNewLocationOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentRole !== "owner") {
      addToast({
        type: "error",
        title: "Permission Denied",
        description: "Only Owners can create or edit cafe locations.",
      });
      return;
    }

    if (!name || !address) {
      alert("Name and address are required.");
      return;
    }

    saveLocation({
      id: `loc-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      address,
      phone,
      capacity: Number(capacity),
      latitude: Number(latitude),
      longitude: Number(longitude),
      hours,
      timezone: "America/New_York",
      active: true,
      createdAt: new Date().toISOString(),
    });

    setName("");
    setAddress("");
    setPhone("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#33241A]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-lg shadow-2xl border border-[#E8DFD5] overflow-hidden font-sans animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#E4E4E7] bg-[#FAFAFA] flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold text-lg text-[#18181B]">Add Cafe Location</h3>
            <p className="text-xs font-mono text-[#71717A]">Configure street address, coordinates & default schedule</p>
          </div>
          <button
            onClick={() => setNewLocationOpen(false)}
            className="p-1.5 text-[#8C7B6E] hover:text-[#33241A] hover:bg-[#FBF6EF] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Location Profile */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8C7B6E] font-semibold border-b border-[#E8DFD5] pb-1">
              Section 1 — Location Profile & Contact
            </h4>
            <div>
              <label className="block text-xs font-semibold text-[#33241A] mb-1">
                Location Title <span className="text-[#C1633B]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vine & Clay — Mercer St Flagship"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="admin-input w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#33241A] mb-1">
                  Phone Number <span className="text-[#C1633B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="(212) 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="admin-input w-full font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#33241A] mb-1">
                  Guest Capacity <span className="text-[#C1633B]">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={10}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="admin-input w-full font-mono text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#33241A] mb-1">
                Street Address <span className="text-[#C1633B]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="142 Mercer Street, New York, NY 10012"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="admin-input w-full"
              />
            </div>
          </div>

          {/* Section 2: Mapping Coordinates (Optional Toggle) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="text-xs font-mono text-[#C1633B] hover:underline flex items-center gap-1 font-medium"
            >
              <span>{showMoreOptions ? "— Hide GPS coordinates" : "+ Add GPS coordinates"}</span>
            </button>

            {showMoreOptions && (
              <div className="space-y-3 pt-3 animate-in fade-in duration-150">
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8C7B6E] font-semibold border-b border-[#E8DFD5] pb-1">
                  Section 2 — GPS Map Coordinates
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#33241A] mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(Number(e.target.value))}
                      className="admin-input w-full font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#33241A] mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(Number(e.target.value))}
                      className="admin-input w-full font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Default Operating Schedule */}
          <div className="p-3.5 bg-[#FAF8F5] border border-[#E8DFD5] rounded-md space-y-2">
            <h4 className="text-[10px] font-mono text-[#8C7B6E] uppercase font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#6B7548]" />
              Default Operating Schedule
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex justify-between p-1.5 bg-white rounded border border-[#E8DFD5]">
                <span className="text-[#66584C]">Mon–Wed:</span>
                <span className="font-semibold text-[#33241A] tabular-nums">07:00 – 18:00</span>
              </div>
              <div className="flex justify-between p-1.5 bg-white rounded border border-[#E8DFD5]">
                <span className="text-[#66584C]">Thu–Fri:</span>
                <span className="font-semibold text-[#33241A] tabular-nums">07:00 – 20:00</span>
              </div>
              <div className="flex justify-between p-1.5 bg-white rounded border border-[#E8DFD5]">
                <span className="text-[#66584C]">Saturday:</span>
                <span className="font-semibold text-[#33241A] tabular-nums">08:00 – 20:00</span>
              </div>
              <div className="flex justify-between p-1.5 bg-white rounded border border-[#E8DFD5]">
                <span className="text-[#66584C]">Sunday:</span>
                <span className="font-semibold text-[#33241A] tabular-nums">08:00 – 18:00</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8DFD5] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewLocationOpen(false)}
              className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#FBF6EF] border border-[#E8DFD5] text-[#33241A] text-xs font-medium rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#C1633B] hover:bg-[#a9532f] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
            >
              Save Location Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

