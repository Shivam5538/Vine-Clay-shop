"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminStore } from "../store/useAdminStore";
import { getModuleColor, AdminModuleType } from "../lib/colorMap";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  MapPin,
  UtensilsCrossed,
  Users,
  MessageSquare,
  Settings,
  Palette,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    orders,
    bookings,
    inquiries,
    currentRole,
    staffUsers,
    setNewBookingOpen,
  } = useAdminStore();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "received" || o.status === "preparing"
  ).length;

  const pendingBookingsCount = bookings.filter((b) => b.status === "pending").length;
  const unreadMessagesCount = inquiries.filter((i) => i.unread).length;

  // Staff first name lookup from state
  const activeUser = staffUsers.find(u => u.role === currentRole);
  const staffFirstName = activeUser ? activeUser.name.split(" ")[0] : "Admin";

  interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    module?: AdminModuleType;
    badgeCount?: number;
  }

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ClipboardList,
      module: "orders",
      badgeCount: pendingOrdersCount,
    },
    {
      name: "Bookings",
      href: "/admin/bookings",
      icon: CalendarDays,
      module: "bookings",
      badgeCount: pendingBookingsCount,
    },
    {
      name: "Locations",
      href: "/admin/locations",
      icon: MapPin,
      module: "locations",
    },
    {
      name: "Menu",
      href: "/admin/menu",
      icon: UtensilsCrossed,
      module: "menu",
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: Users,
      module: "customers",
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      module: "messages",
      badgeCount: unreadMessagesCount,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      module: "settings",
    },
    {
      name: "Styleguide",
      href: "/admin/styleguide",
      icon: Palette,
    },
  ];

  return (
    <aside
      className={`bg-[#0F172A] text-slate-200 flex flex-col shrink-0 h-screen sticky top-0 font-sans z-30 select-none transition-all duration-300 border-r border-slate-800 ${
        isCollapsed ? "w-16" : "w-[260px]"
      }`}
    >
      {/* Top Welcome Header — Staff First Name in Warm Terracotta */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between min-h-[76px]">
        {!isCollapsed ? (
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-semibold">
              WELCOME
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-[#E05628] tracking-tight">
                {staffFirstName}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({currentRole})
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto" title={`Welcome ${staffFirstName}`}>
            <span className="w-3 h-3 rounded-full bg-[#E05628] block" />
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title={isCollapsed ? "Expand Sidebar (260px)" : "Collapse Sidebar (64px)"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        <button
          onClick={() => setNewBookingOpen(true)}
          className={`w-full bg-[#E05628] hover:bg-[#c9451a] text-white rounded-xl text-xs font-semibold flex items-center justify-center transition-all shadow-xs active:scale-[0.98] ${
            isCollapsed ? "py-2.5 px-0" : "py-2.5 px-3 gap-2"
          }`}
          title="New Booking"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>New Booking</span>}
        </button>
      </div>

      {/* Primary Navigation — Solid Pill Card behind Active Item */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          const colorConfig = item.module ? getModuleColor(item.module) : null;

          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center justify-between px-3 py-2.5 text-xs rounded-xl transition-all ${
                isActive
                  ? "bg-slate-800/90 text-white font-semibold shadow-xs border border-slate-700/60"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/40 font-medium"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {colorConfig && isActive ? (
                  <span
                    className={`w-2 h-2 rounded-full ${colorConfig.bgSolid} shrink-0`}
                  />
                ) : null}
                <Icon
                  className={`w-4.5 h-4.5 shrink-0 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </div>

              {/* Notification Badges */}
              {item.badgeCount && item.badgeCount > 0 ? (
                <span
                  className={`min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                    isCollapsed ? "absolute top-1 right-1 border border-[#0F172A]" : "ml-auto"
                  }`}
                >
                  {item.badgeCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Visually Separated Bottom Footer */}
      <div className="p-3 border-t border-slate-800/80 space-y-1 bg-[#0B1120]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/50 transition-colors"
          title="View Site"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" />
          {!isCollapsed && <span>View Site</span>}
        </Link>
        <Link
          href="/admin/login"
          className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800/50 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0 text-slate-400" />
          {!isCollapsed && <span>Sign Out</span>}
        </Link>
      </div>
    </aside>
  );
}
