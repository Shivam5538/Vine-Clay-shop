"use client";

import React, { useState } from "react";
import {
  OrderStatusBadge,
  BookingStatusBadge,
  OrderTypeBadge,
  PaymentStatusBadge,
} from "@/features/admin/components/StatusBadge";
import {
  Plus,
  ArrowRight,
  RotateCcw,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function AdminStyleguidePage() {
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("flagship");

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-2 font-sans">
      {/* Header — Zero Serif / Fraunces Removed */}
      <div className="pb-4 border-b border-[#E4E4E7] space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717A]">
          2026 Modern SaaS Design System
        </span>
        <h1 className="font-sans text-2xl font-bold text-[#18181B] tracking-tight">
          Admin Styleguide
        </h1>
        <p className="text-xs text-[#71717A] max-w-2xl">
          Zero-serif typography hierarchy using DM Sans throughout. Near-black `#18181B` text, mid-gray `#71717A` secondary text, refined vibrant terracotta (`#E05628`), modern green (`#16A34A`), and soft background washes.
        </p>
      </div>

      {/* 1. Typography & Data Font Convention */}
      <section className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#71717A] font-bold border-b border-[#E4E4E7] pb-2">
          1. Typography & Data Monospace Scale (Zero Serif System)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#FAFAFA] p-5 border border-[#E4E4E7] rounded-lg">
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-[#71717A] uppercase block">DM Sans (Module Title Scale)</span>
            <h1 className="font-sans text-2xl font-bold tracking-tight text-[#18181B]">Dashboard Title</h1>
            <p className="text-xs text-[#71717A]">Clean, modern sans-serif headings replacing display serifs.</p>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono text-[#71717A] uppercase block">DM Sans (Labels & Body)</span>
            <p className="font-sans font-semibold text-sm text-[#18181B]">Section Subheading</p>
            <p className="font-sans text-xs text-[#71717A]">Workhorse font for navigation links, form labels, and body paragraphs.</p>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono text-[#71717A] uppercase block">DM Mono (All Data Items)</span>
            <div className="font-mono text-xs space-y-1 text-[#18181B]">
              <p>ID: <span className="font-bold text-[#E05628]">#VC-8942</span></p>
              <p>Price: <span className="tabular-nums font-semibold">$34.50</span></p>
              <p>Time: <span className="tabular-nums text-[#71717A]">14:30:00 EST</span></p>
              <p>Phone: <span className="tabular-nums text-[#71717A]">(555) 019-2831</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Refined Modern Saturated Status Badges */}
      <section className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#71717A] font-bold border-b border-[#E4E4E7] pb-2">
          2. Refined Modern Saturated Status Badges
        </h3>
        <div className="p-5 bg-white border border-[#E4E4E7] rounded-lg space-y-4 shadow-2xs">
          <div>
            <span className="text-[11px] font-mono text-[#71717A] uppercase block mb-2">Order Status Badges (Vibrant Terracotta Pending • Emerald Completed)</span>
            <div className="flex flex-wrap items-center gap-3">
              <OrderStatusBadge status="received" />
              <OrderStatusBadge status="preparing" />
              <OrderStatusBadge status="ready" />
              <OrderStatusBadge status="completed" />
              <OrderStatusBadge status="cancelled" />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E4E4E7]">
            <span className="text-[11px] font-mono text-[#71717A] uppercase block mb-2">Booking Status Badges</span>
            <div className="flex flex-wrap items-center gap-3">
              <BookingStatusBadge status="pending" />
              <BookingStatusBadge status="confirmed" />
              <BookingStatusBadge status="seated" />
              <BookingStatusBadge status="completed" />
              <BookingStatusBadge status="cancelled" />
              <BookingStatusBadge status="no_show" />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E4E4E7]">
            <span className="text-[11px] font-mono text-[#71717A] uppercase block mb-2">Order Type & Payment Badges</span>
            <div className="flex flex-wrap items-center gap-3">
              <OrderTypeBadge type="pickup" />
              <OrderTypeBadge type="delivery" />
              <OrderTypeBadge type="dine_in" />
              <PaymentStatusBadge status="paid" />
              <PaymentStatusBadge status="pending" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Button & Action Hierarchy */}
      <section className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#71717A] font-bold border-b border-[#E4E4E7] pb-2">
          3. Button & Action Hierarchy
        </h3>
        <div className="p-5 bg-white border border-[#E4E4E7] rounded-lg flex flex-wrap items-center gap-4 shadow-2xs">
          {/* Primary Terracotta */}
          <div className="space-y-1">
            <button className="px-4 py-2 bg-[#E05628] hover:bg-[#c9451a] text-white rounded-md text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors active:scale-[0.99]">
              <Plus className="w-4 h-4" />
              <span>Primary Action (+ New)</span>
            </button>
            <span className="text-[10px] font-mono text-[#71717A] block text-center">Terracotta (#E05628)</span>
          </div>

          {/* Secondary Neutral */}
          <div className="space-y-1">
            <button className="px-4 py-2 bg-[#FAFAFA] hover:bg-[#F4F4F5] border border-[#E4E4E7] text-[#18181B] rounded-md text-xs font-medium flex items-center gap-2 transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Secondary Action</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#71717A]" />
            </button>
            <span className="text-[10px] font-mono text-[#71717A] block text-center">Neutral Surface</span>
          </div>

          {/* Destructive Red */}
          <div className="space-y-1">
            <button className="px-4 py-2 bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FEE2E2] text-[#DC2626] rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cancel / Delete</span>
            </button>
            <span className="text-[10px] font-mono text-[#71717A] block text-center">Destructive Action</span>
          </div>
        </div>
      </section>

      {/* 4. Form Field Styling & Focus Ring */}
      <section className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#71717A] font-bold border-b border-[#E4E4E7] pb-2">
          4. Form Inputs & Terracotta Focus Ring
        </h3>
        <div className="p-5 bg-white border border-[#E4E4E7] rounded-lg max-w-xl space-y-4 shadow-2xs">
          <div>
            <label className="block text-xs font-semibold text-[#18181B] mb-1">
              Customer Full Name <span className="text-[#E05628]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Eleanor Vance"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-white border border-[#E4E4E7] rounded-md px-3 py-2 text-xs text-[#18181B] focus:outline-none focus:border-[#E05628] focus:ring-1 focus:ring-[#E05628] shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18181B] mb-1">
              Select Location Scope <span className="text-[#E05628]">*</span>
            </label>
            <select
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              className="w-full bg-white border border-[#E4E4E7] rounded-md px-3 py-2 text-xs text-[#18181B] focus:outline-none focus:border-[#E05628] focus:ring-1 focus:ring-[#E05628] cursor-pointer shadow-2xs"
            >
              <option value="flagship">Vine & Clay — Flagship Ceramic Studio & Cafe</option>
              <option value="brooklyn">Vine & Clay — Brooklyn Kiln Room</option>
            </select>
          </div>
        </div>
      </section>

      {/* 5. Clean Table Surface */}
      <section className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#71717A] font-bold border-b border-[#E4E4E7] pb-2">
          5. Data Table Surface (Modern 5-Column Alignment)
        </h3>
        <div className="bg-white border border-[#E4E4E7] rounded-lg overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FAFAFA] border-b border-[#E4E4E7] text-[10px] font-mono text-[#71717A] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Customer & Ref</th>
                <th className="py-3 px-4 text-center">Fulfillment</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Items & Total</th>
                <th className="py-3 px-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7] text-[#18181B]">
              <tr className="hover:bg-[#FAFAFA] cursor-pointer transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#E05628]">#VC-9012</span>
                    <span className="font-semibold">Eleanor Vance</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <OrderTypeBadge type="pickup" />
                </td>
                <td className="py-3.5 px-4 text-center">
                  <OrderStatusBadge status="preparing" />
                </td>
                <td className="py-3.5 px-4 font-mono text-right tabular-nums">
                  <span className="text-[#71717A]">2 items</span> • <strong className="text-[#18181B]">$40.50</strong>
                </td>
                <td className="py-3.5 px-4 font-mono text-[#71717A] text-right tabular-nums">
                  4m ago
                </td>
              </tr>

              <tr className="hover:bg-[#FAFAFA] cursor-pointer transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#E05628]">#VC-9011</span>
                    <span className="font-semibold">Marcus Sterling</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <OrderTypeBadge type="delivery" />
                </td>
                <td className="py-3.5 px-4 text-center">
                  <OrderStatusBadge status="ready" />
                </td>
                <td className="py-3.5 px-4 font-mono text-right tabular-nums">
                  <span className="text-[#71717A]">1 item</span> • <strong className="text-[#18181B]">$68.00</strong>
                </td>
                <td className="py-3.5 px-4 font-mono text-[#71717A] text-right tabular-nums">
                  18m ago
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Application States */}
      <section className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#71717A] font-bold border-b border-[#E4E4E7] pb-2">
          6. State Patterns (Empty, Skeleton Loading, Error)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Empty State */}
          <div className="bg-white border border-[#E4E4E7] rounded-lg p-6 text-center space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FFF4F0] border border-[#FFDDD2] flex items-center justify-center mx-auto text-[#E05628]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#18181B]">No active orders right now</h4>
              <p className="text-[11px] text-[#71717A] mt-0.5">New web or POS orders will display here automatically.</p>
            </div>
            <button className="px-3 py-1.5 bg-[#E05628] text-white rounded text-xs font-medium font-mono shadow-2xs">
              + New Order
            </button>
          </div>

          {/* Skeleton Loading State */}
          <div className="bg-white border border-[#E4E4E7] rounded-lg p-5 space-y-3 animate-pulse shadow-2xs">
            <div className="h-4 w-32 bg-[#F4F4F5] rounded" />
            <div className="h-3 w-48 bg-[#F4F4F5] rounded" />
            <div className="h-16 w-full bg-[#F4F4F5] rounded-md mt-4" />
          </div>

          {/* Actionable Error State */}
          <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg p-4 space-y-2 text-xs text-[#DC2626]">
            <div className="flex items-center gap-2 font-mono font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Database Connection Reconnecting</span>
            </div>
            <p className="text-[11px] text-[#DC2626]/80 font-sans">
              Unable to reach Supabase realtime channel. Retrying automatically in 5 seconds...
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
