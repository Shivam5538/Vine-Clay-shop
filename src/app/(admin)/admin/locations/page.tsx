"use client";

import React from "react";
import { useAdminStore } from "@/features/admin/store/useAdminStore";
import { getModuleColor } from "@/features/admin/lib/colorMap";
import { StatCard } from "@/features/admin/components/StatCard";
import { MapPin, Clock, Plus, Building2, Globe, Users, ShieldCheck } from "lucide-react";

export default function AdminLocationsPage() {
  const { locations, setNewLocationOpen, saveLocation, currentRole, addToast } = useAdminStore();
  const colorConfig = getModuleColor("locations");

  const activeCount = locations.filter((l) => l.active).length;
  const totalCapacity = locations.reduce((sum, l) => sum + l.capacity, 0);

  const handleToggleActive = (id: string) => {
    if (currentRole !== "owner") {
      addToast({
        type: "error",
        title: "Permission Denied",
        description: "Only Owners can toggle location active status.",
      });
      return;
    }

    const loc = locations.find((l) => l.id === id);
    if (loc) {
      saveLocation({ ...loc, active: !loc.active });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-8">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-lg ${colorConfig.bgSolid} text-white flex items-center justify-center shrink-0 shadow-xs`}
          >
            <MapPin className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Locations & Studio Outlets
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Manage store addresses, GPS coordinates, seat capacity, and operating schedules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNewLocationOpen(true)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Location</span>
          </button>
        </div>
      </div>

      {/* Module Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Locations"
          value={locations.length}
          icon={MapPin}
          bgSolid={colorConfig.bgSolid}
          subtext="Active studios & cafes"
        />
        <StatCard
          label="Active Sites"
          value={activeCount}
          icon={Building2}
          bgSolid="bg-emerald-600"
          delta={activeCount > 0 ? "100% Operational" : undefined}
          subtext="Open to public"
        />
        <StatCard
          label="Total Seating Capacity"
          value={totalCapacity}
          icon={Users}
          bgSolid="bg-purple-600"
          subtext="Across all floors"
        />
        <StatCard
          label="API Sync Status"
          value="Online"
          icon={ShieldCheck}
          bgSolid="bg-sky-600"
          subtext="Supabase live feed"
        />
      </div>

      {/* Locations Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {locations.map((location) => (
          <div
            key={location.id}
            className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-4 p-6"
          >
            {/* Location Title & Status Pill */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <h3 className="font-bold text-base text-slate-900">{location.name}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {location.address}
                </p>
              </div>

              <button
                onClick={() => handleToggleActive(location.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  location.active
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {location.active ? "● Active Site" : "● Closed"}
              </button>
            </div>

            {/* Phone & Coordinates */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Phone Contact</span>
                <span className="font-bold text-slate-900 tabular-nums">{location.phone}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">GPS Coordinates</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Operating Hours Schedule */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                Operating Schedule
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {Object.entries(location.hours).map(([day, h]) => (
                  <div
                    key={day}
                    className="p-2 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center"
                  >
                    <span className="capitalize text-slate-600">{day}:</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {h.closed ? "Closed" : `${h.open} – ${h.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* API Sync Badge */}
            <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="text-teal-700 font-semibold flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-teal-600" />
                Live API feed synced to Public Site
              </span>
              <span className="text-teal-600 text-[10px] font-bold">JSON Endpoint Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
