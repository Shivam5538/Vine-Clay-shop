"use client";

import React, { useState, useEffect } from "react";
import { useAdminStore } from "@/features/admin/store/useAdminStore";
import { formatTime, formatTimeWithSeconds } from "@/lib/format-date";
import { StatCard } from "@/features/admin/components/StatCard";
import { QuickActionRow } from "@/features/admin/components/QuickActionRow";
import { ActivityItem } from "@/features/admin/components/ActivityItem";
import { AlertBanner } from "@/features/admin/components/AlertBanner";
import { getModuleColor, AdminModuleType } from "@/features/admin/lib/colorMap";
import {
  ClipboardList,
  CalendarDays,
  UtensilsCrossed,
  MessageSquare,
  Zap,
  Clock,
  MapPin,
  Globe,
  Plus,
  ArrowRight,
  Coffee,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    orders,
    bookings,
    menuItems,
    inquiries,
    activeLocationId,
    locations,
    activityLogs,
    setSelectedOrderId,
    setSelectedBookingId,
    setNewBookingOpen,
    setNewMenuItemOpen,
  } = useAdminStore();

  const filteredOrders = orders.filter(
    (o) => activeLocationId === "all" || o.locationId === activeLocationId
  );

  const filteredBookings = bookings.filter(
    (b) => activeLocationId === "all" || b.locationId === activeLocationId
  );

  const filteredMenuItems = menuItems.filter((i) => i.isAvailable);

  // Metrics
  const pendingOrders = filteredOrders.filter(
    (o) => o.status === "received" || o.status === "preparing"
  );
  const pendingOrdersCount = pendingOrders.length;

  const upcomingBookings = filteredBookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );
  const upcomingBookingsCount = upcomingBookings.length;

  const unreadInquiries = inquiries.filter((i) => i.unread);
  const unreadInquiriesCount = unreadInquiries.length;

  const totalOrdersToday = filteredOrders.length;
  const totalRevenue = filteredOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const currentLocationName =
    activeLocationId === "all"
      ? "All Locations"
      : locations.find((l) => l.id === activeLocationId)?.name || "Current Location";

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-8">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage orders, bookings, and today&apos;s operations across {currentLocationName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNewBookingOpen(true)}
            className="px-4 py-2.5 bg-[#E05628] hover:bg-[#c9451a] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* 2. Notification / Alert Banner (Only shown when something needs attention) */}
      {(pendingOrdersCount > 0 || unreadInquiriesCount > 0 || upcomingBookingsCount > 0) && (
        <AlertBanner
          headline={
            pendingOrdersCount > 0
              ? `${pendingOrdersCount} Order${pendingOrdersCount > 1 ? "s" : ""} Awaiting Dispatch`
              : unreadInquiriesCount > 0
              ? `${unreadInquiriesCount} New Customer Inquiry`
              : `${upcomingBookingsCount} Upcoming Table Reservation${upcomingBookingsCount > 1 ? "s" : ""}`
          }
          description={
            pendingOrdersCount > 0
              ? `Bar and kitchen staff are currently preparing ${pendingOrdersCount} live order ticket${
                  pendingOrdersCount > 1 ? "s" : ""
                }. Check queue for ready status.`
              : unreadInquiriesCount > 0
              ? `You have ${unreadInquiriesCount} unread message${
                  unreadInquiriesCount > 1 ? "s" : ""
                } regarding private ceramic workshops and reservations.`
              : `Review confirmed table assignments and guest requests for upcoming shift.`
          }
          pillLabel="NEEDS ATTENTION"
          buttonText={pendingOrdersCount > 0 ? "View Orders →" : unreadInquiriesCount > 0 ? "View Messages →" : "View Bookings →"}
          buttonHref={pendingOrdersCount > 0 ? "/admin/orders" : unreadInquiriesCount > 0 ? "/admin/messages" : "/admin/bookings"}
          icon={pendingOrdersCount > 0 ? ClipboardList : unreadInquiriesCount > 0 ? MessageSquare : CalendarDays}
          bgWash="bg-blue-50/80 border-blue-100"
          iconBgSolid="bg-blue-600"
          buttonBgSolid="bg-blue-600 hover:bg-blue-700"
          pillBgSolid="bg-blue-600"
        />
      )}

      {/* 3. Stat Cards Row (4 cards with exact internal structure) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Orders Today"
          value={totalOrdersToday}
          icon={ClipboardList}
          bgSolid={getModuleColor("orders").bgSolid}
          delta={totalOrdersToday > 0 ? `+$${totalRevenue.toFixed(0)} sales` : undefined}
          subtext={`${pendingOrdersCount} pending prep`}
        />

        <StatCard
          label="Upcoming Bookings"
          value={upcomingBookingsCount}
          icon={CalendarDays}
          bgSolid={getModuleColor("bookings").bgSolid}
          delta={upcomingBookingsCount > 0 ? `Today` : undefined}
          subtext="Confirmed seats"
        />

        <StatCard
          label="Active Menu Items"
          value={filteredMenuItems.length}
          icon={UtensilsCrossed}
          bgSolid={getModuleColor("menu").bgSolid}
          subtext="In kitchen & bar"
        />

        <StatCard
          label="Unread Messages"
          value={unreadInquiriesCount}
          icon={MessageSquare}
          bgSolid={getModuleColor("messages").bgSolid}
          hasUnreadBadge={unreadInquiriesCount > 0}
          subtext={unreadInquiriesCount > 0 ? "Needs reply" : "Inbox cleared"}
        />
      </div>

      {/* 4. Two-Column Lower Section: Quick Actions (Left) + Recent Activity (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Wider, Quick Actions + Order Board Overview) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section Label */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>QUICK ACTIONS</span>
            </div>

            {/* 2-Column Action Rows Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Featured Action Row */}
              <div className="sm:col-span-2">
                <QuickActionRow
                  label="View Live Site"
                  subtext="Open public studio & cafe storefront in new window"
                  icon={Globe}
                  bgSolid={getModuleColor("menu").bgSolid}
                  isFeatured={true}
                  href="/"
                />
              </div>

              <QuickActionRow
                label="New Booking"
                subtext="Reserve table slot"
                icon={CalendarDays}
                bgSolid={getModuleColor("bookings").bgSolid}
                onClick={() => setNewBookingOpen(true)}
              />

              <QuickActionRow
                label="Add Menu Item"
                subtext="Create food or beverage"
                icon={UtensilsCrossed}
                bgSolid={getModuleColor("menu").bgSolid}
                onClick={() => setNewMenuItemOpen(true)}
              />

              <QuickActionRow
                label="View Orders Board"
                subtext="Live kitchen tickets"
                icon={ClipboardList}
                bgSolid={getModuleColor("orders").bgSolid}
                href="/admin/orders"
              />

              <QuickActionRow
                label="Manage Locations"
                subtext="Hours & capacity"
                icon={MapPin}
                bgSolid={getModuleColor("locations").bgSolid}
                href="/admin/locations"
              />
            </div>
          </div>

          {/* Kitchen & Bar Queue Snippet in Card Container */}
          <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Active Kitchen & Bar Queue
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click order row to inspect details
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Full Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
                  <Coffee className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No active orders</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">New customer orders will appear here in real time.</p>
                </div>
              ) : (
                filteredOrders.slice(0, 4).map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className="p-3.5 bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/60 rounded-xl flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs font-bold text-blue-600 shrink-0">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {order.customerName}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                      <span className="text-slate-500 font-sans text-xs">
                        {order.items.length} items
                      </span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        ${order.total.toFixed(2)}
                      </span>
                      <span className="text-slate-400 text-[11px] tabular-nums hidden sm:inline">
                        {mounted ? formatTime(order.receivedAt) : "..."}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Narrower, Recent Activity) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>RECENT ACTIVITY</span>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
              {activityLogs.length === 0 ? (
                <p className="text-xs text-slate-400 font-mono text-center py-4">
                  No recent activity logged
                </p>
              ) : (
                activityLogs.slice(0, 6).map((log) => {
                  const moduleType: AdminModuleType =
                    log.entityType === "order"
                      ? "orders"
                      : log.entityType === "booking"
                      ? "bookings"
                      : log.entityType === "menu"
                      ? "menu"
                      : log.entityType === "location"
                      ? "locations"
                      : log.entityType === "message"
                      ? "messages"
                      : "settings";

                  const colorConfig = getModuleColor(moduleType);

                  return (
                    <ActivityItem
                      key={log.id}
                      subject={log.action}
                      description={log.details}
                      timestamp={mounted ? formatTimeWithSeconds(log.timestamp) : "..."}
                      icon={colorConfig.icon}
                      bgSolid={colorConfig.bgSolid}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Table Reservations Widget */}
          <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900">Upcoming Reservations</h3>
              </div>
              <Link href="/admin/bookings" className="text-xs font-mono text-purple-600 hover:underline">
                View all →
              </Link>
            </div>

            <div className="space-y-2.5">
              {upcomingBookings.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBookingId(b.id)}
                  className="p-3 bg-purple-50/50 hover:bg-purple-50 border border-purple-100 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{b.customerName}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {b.partySize} guests • {b.tableName || "T-01"}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-semibold text-purple-700 bg-white px-2 py-1 rounded-lg border border-purple-200">
                    {mounted ? formatTime(b.dateTime) : "..."}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
