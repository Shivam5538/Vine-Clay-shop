"use client";

import React, { useState } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { X } from "lucide-react";
import { UserRole } from "../types/admin";

export function InviteStaffModal() {
  const { isInviteStaffOpen, setInviteStaffOpen, inviteStaff, locations, currentRole, addToast } = useAdminStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("staff");
  const [assignedLocationIds, setAssignedLocationIds] = useState<string[]>([
    locations[0]?.id || "loc-downtown",
  ]);

  if (!isInviteStaffOpen) return null;

  const handleLocationToggle = (id: string) => {
    if (assignedLocationIds.includes(id)) {
      if (assignedLocationIds.length > 1) {
        setAssignedLocationIds(assignedLocationIds.filter((locId) => locId !== id));
      }
    } else {
      setAssignedLocationIds([...assignedLocationIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentRole !== "owner") {
      addToast({
        type: "error",
        title: "Permission Denied",
        description: "Only Owners can invite or assign staff account roles.",
      });
      return;
    }

    if (!name || !email) {
      alert("Name and Email are required.");
      return;
    }

    inviteStaff({
      name,
      email,
      role,
      assignedLocationIds,
      active: true,
    });

    setName("");
    setEmail("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#33241A]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-[#E8DFD5] overflow-hidden font-sans animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#E8DFD5] bg-[#FAF8F5] flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold text-lg text-[#18181B]">Invite Staff Member</h3>
            <p className="text-xs font-mono text-[#8C7B6E]">Dispatch invitation email & assign role permissions</p>
          </div>
          <button
            onClick={() => setInviteStaffOpen(false)}
            className="p-1.5 text-[#8C7B6E] hover:text-[#33241A] hover:bg-[#FBF6EF] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Member Identity */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8C7B6E] font-semibold border-b border-[#E8DFD5] pb-1">
              Section 1 — Staff Member Identity
            </h4>
            <div>
              <label className="block text-xs font-semibold text-[#33241A] mb-1">
                Full Name <span className="text-[#C1633B]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Liam O'Connor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="admin-input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#33241A] mb-1">
                Staff Email Address <span className="text-[#C1633B]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="liam@vineandclay.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input w-full font-mono text-xs"
              />
            </div>
          </div>

          {/* Section 2: Role & Scope */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8C7B6E] font-semibold border-b border-[#E8DFD5] pb-1">
              Section 2 — System Role & Site Privileges
            </h4>
            <div>
              <label className="block text-xs font-semibold text-[#33241A] mb-1">
                Assigned Role <span className="text-[#C1633B]">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="admin-input w-full cursor-pointer font-mono text-xs"
              >
                <option value="staff">Staff — Orders & Bookings for assigned site</option>
                <option value="manager">Manager — Orders, Bookings, Menu & Floor Tables</option>
                <option value="owner">Owner — Full multi-site admin & staff control</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#33241A] mb-1.5">
                Assigned Cafe Locations
              </label>
              <div className="space-y-1.5">
                {locations.map((loc) => {
                  const isAssigned = assignedLocationIds.includes(loc.id);
                  return (
                    <label
                      key={loc.id}
                      className={`flex items-center gap-2.5 p-2.5 rounded border text-xs cursor-pointer transition-colors ${
                        isAssigned ? "bg-[#FAF8F5] border-[#C1633B]/50" : "bg-white border-[#E8DFD5]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={() => handleLocationToggle(loc.id)}
                        className="accent-[#C1633B] w-4 h-4"
                      />
                      <span className="font-semibold text-[#33241A]">{loc.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8DFD5] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setInviteStaffOpen(false)}
              className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#FBF6EF] border border-[#E8DFD5] text-[#33241A] text-xs font-medium rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#C1633B] hover:bg-[#a9532f] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
            >
              Send Staff Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

