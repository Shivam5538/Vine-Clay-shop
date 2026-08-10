"use client";

import React, { useState, useEffect } from "react";
import { useAdminStore } from "@/features/admin/store/useAdminStore";
import { OrderStatusBadge, OrderTypeBadge } from "@/features/admin/components/StatusBadge";
import { OrderStatus } from "@/features/admin/types/admin";
import { getMinutesElapsed } from "@/lib/format-date";
import { getModuleColor } from "@/features/admin/lib/colorMap";
import { StatCard } from "@/features/admin/components/StatCard";
import {
  ClipboardList,
  Kanban,
  ChevronRight,
  Search,
  Zap,
  Coffee,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function AdminOrdersPage() {
  const {
    orders,
    activeLocationId,
    setSelectedOrderId,
    simulateIncomingOrder,
  } = useAdminStore();

  const [mounted, setMounted] = useState(false);
  const [nowTime, setNowTime] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [selectedTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    setNowTime(Date.now());
    const interval = setInterval(() => {
      setNowTime(Date.now());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const colorConfig = getModuleColor("orders");

  // Contextual Filtering inside Orders Module
  const filteredOrders = orders.filter((order) => {
    if (activeLocationId !== "all" && order.locationId !== activeLocationId) return false;
    if (selectedStatusFilter !== "all" && order.status !== selectedStatusFilter) return false;
    if (selectedTypeFilter !== "all" && order.orderType !== selectedTypeFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.toLowerCase().includes(q);
      const matchItems = order.items.some((i) => i.name.toLowerCase().includes(q));
      return matchNum || matchName || matchPhone || matchItems;
    }

    return true;
  });

  const receivedCount = orders.filter((o) => o.status === "received").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  const columns: { status: OrderStatus; label: string; dotColor: string }[] = [
    { status: "received", label: "Received", dotColor: "bg-blue-600" },
    { status: "preparing", label: "Preparing", dotColor: "bg-orange-500" },
    { status: "ready", label: "Ready for Pickup", dotColor: "bg-emerald-500" },
    { status: "completed", label: "Completed", dotColor: "bg-slate-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-8">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-lg ${colorConfig.bgSolid} text-white flex items-center justify-center shrink-0 shadow-xs`}
          >
            <ClipboardList className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Orders Dispatch Board
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Manage live kitchen tickets, order prep, pass readiness, and fulfillment history
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={simulateIncomingOrder}
            className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100/80 text-blue-700 border border-blue-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-xs active:scale-[0.98]"
          >
            <Zap className="w-4 h-4 text-blue-600" />
            <span>Simulate Order</span>
          </button>
        </div>
      </div>

      {/* Module Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="New Received"
          value={receivedCount}
          icon={ClipboardList}
          bgSolid="bg-blue-600"
          delta={receivedCount > 0 ? "Needs prep" : undefined}
          subtext="Unprocessed tickets"
        />
        <StatCard
          label="In Bar / Kitchen"
          value={preparingCount}
          icon={Coffee}
          bgSolid="bg-orange-500"
          subtext="Being prepared"
        />
        <StatCard
          label="Ready for Pickup"
          value={readyCount}
          icon={CheckCircle2}
          bgSolid="bg-emerald-500"
          delta={readyCount > 0 ? "Pass Ready" : undefined}
          subtext="Awaiting customer"
        />
        <StatCard
          label="Completed Today"
          value={completedCount}
          icon={Clock}
          bgSolid="bg-slate-600"
          subtext="Fulfilled orders"
        />
      </div>

      {/* Contextual Toolbar: View Toggle & List Search */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-wrap items-center justify-between gap-4">
        {/* Left: Kanban / Table Switcher */}
        <div className="flex items-center gap-1 bg-slate-100/80 border border-slate-200/60 rounded-lg p-1">
          <button
            onClick={() => setViewMode("kanban")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === "kanban"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>

          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === "table"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Data Table</span>
          </button>
        </div>

        {/* Center: Search input */}
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search order #, customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500">Filter:</span>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="received">Received</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* View 1: Kanban Triage Swimlanes */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {columns.map((col) => {
            const colOrders = filteredOrders.filter((o) => o.status === col.status);

            return (
              <div
                key={col.status}
                className="bg-slate-50/80 border border-slate-200/60 rounded-xl overflow-hidden flex flex-col max-h-[calc(100vh-220px)] shadow-xs"
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-slate-200/60 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                    <h3 className="font-mono font-bold text-xs text-slate-900 uppercase tracking-wider">
                      {col.label}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[11px] font-mono font-bold text-slate-700 tabular-nums">
                    {colOrders.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)]">
                  {colOrders.length === 0 ? (
                    <div className="p-6 text-center text-xs font-mono text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      No orders in {col.status}
                    </div>
                  ) : (
                    colOrders.map((order) => {
                      const minsElapsed = nowTime ? getMinutesElapsed(order.receivedAt, nowTime) : 0;

                      return (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrderId(order.id)}
                          className="bg-white hover:bg-blue-50/30 border border-slate-200/80 hover:border-blue-200 rounded-xl p-4 space-y-2 cursor-pointer transition-all shadow-xs"
                        >
                          {/* Card Top */}
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-sm text-blue-600">
                              {order.orderNumber}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                                {mounted && nowTime ? `${minsElapsed}m ago` : "..."}
                              </span>
                              <OrderTypeBadge type={order.orderType} />
                            </div>
                          </div>

                          {/* Customer & Items Summary */}
                          <div>
                            <span className="font-sans font-semibold text-xs text-slate-900 flex items-center justify-between">
                              <span>{order.customerName}</span>
                              <span className="font-mono text-[10px] text-slate-400">{order.customerPhone}</span>
                            </span>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-sans">
                              {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                            </p>
                            {order.notes && (
                              <p className="text-[10px] font-mono text-blue-700 truncate mt-1 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                                {order.notes}
                              </p>
                            )}
                          </div>

                          {/* Footer Action */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                            <span className="font-bold text-slate-900 tabular-nums">
                              ${order.total.toFixed(2)}
                            </span>
                            <span className="text-blue-600 font-semibold hover:underline flex items-center gap-0.5">
                              <span>Details</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Data Table */}
      {viewMode === "table" && (
        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-mono text-slate-500 uppercase tracking-wider sticky top-0">
                <tr>
                  <th className="py-3.5 px-4">Order & Customer</th>
                  <th className="py-3.5 px-4 text-center">Fulfillment</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Items & Total</th>
                  <th className="py-3.5 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-900">
                {filteredOrders.map((order) => {
                  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
                  const minsElapsed = nowTime ? getMinutesElapsed(order.receivedAt, nowTime) : 0;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-600">{order.orderNumber}</span>
                          <span className="font-semibold text-slate-900">{order.customerName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <OrderTypeBadge type={order.orderType} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-right tabular-nums">
                        <span className="text-slate-500">{totalItems} {totalItems === 1 ? "item" : "items"}</span> •{" "}
                        <strong className="text-slate-900">${order.total.toFixed(2)}</strong>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-right tabular-nums">
                        {mounted && nowTime ? `${minsElapsed}m ago` : "..."}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
