"use client";

import React, { useState, useEffect } from "react";
import { useAdminStore } from "@/features/admin/store/useAdminStore";
import { getModuleColor } from "@/features/admin/lib/colorMap";
import { StatCard } from "@/features/admin/components/StatCard";
import { formatTime } from "@/lib/format-date";
import {
  MessageSquare,
  Mail,
  CheckCircle2,
  Filter,
  Sparkles,
  Phone,
} from "lucide-react";

export default function AdminMessagesPage() {
  const [mounted, setMounted] = useState(false);
  const [filterTab, setFilterTab] = useState<"all" | "unread">("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const { inquiries, markInquiryRead } = useAdminStore();
  const colorConfig = getModuleColor("messages");

  const unreadCount = inquiries.filter((i) => i.unread).length;
  const filteredInquiries = inquiries.filter((i) =>
    filterTab === "unread" ? i.unread : true
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-8">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-lg ${colorConfig.bgSolid} text-white flex items-center justify-center shrink-0 shadow-xs`}
          >
            <MessageSquare className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Customer Messages & Inquiries
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Review customer contact forms, private pottery workshop requests, and catering inquiries
            </p>
          </div>
        </div>
      </div>

      {/* Module Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Inquiries"
          value={inquiries.length}
          icon={MessageSquare}
          bgSolid={colorConfig.bgSolid}
          subtext="Received this month"
        />
        <StatCard
          label="Unread Messages"
          value={unreadCount}
          icon={Mail}
          bgSolid="bg-red-500"
          hasUnreadBadge={unreadCount > 0}
          subtext="Needs response"
        />
        <StatCard
          label="Workshop Requests"
          value={2}
          icon={Sparkles}
          bgSolid="bg-purple-600"
          subtext="Pottery & glaze classes"
        />
        <StatCard
          label="Response Rate"
          value="98%"
          icon={CheckCircle2}
          bgSolid="bg-emerald-600"
          delta="+4% vs last week"
          subtext="Avg reply under 2 hrs"
        />
      </div>

      {/* Main Content Area Container */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] overflow-hidden">
        {/* Card Header & Filter Tabs */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Filter Messages
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterTab === "all"
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Messages ({inquiries.length})
            </button>
            <button
              onClick={() => setFilterTab("unread")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterTab === "unread"
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Message Cards List */}
        <div className="divide-y divide-slate-100">
          {filteredInquiries.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">No messages found</p>
              <p className="text-xs text-slate-400 mt-1">All customer inquiries in this view have been attended to.</p>
            </div>
          ) : (
            filteredInquiries.map((inq) => (
              <div
                key={inq.id}
                className={`p-6 transition-colors ${
                  inq.unread ? "bg-emerald-50/30" : "hover:bg-slate-50/60"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {inq.unread && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      )}
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">
                        {inq.subject}
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {inq.locationId === "loc-downtown" ? "Soho Flagship" : "Brooklyn Kiln"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium flex-wrap">
                      <span className="font-semibold text-slate-900">{inq.customerName}</span>
                      <span>•</span>
                      <a href={`mailto:${inq.customerEmail}`} className="text-emerald-600 hover:underline">
                        {inq.customerEmail}
                      </a>
                      {inq.customerPhone && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {inq.customerPhone}
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pt-1 font-sans">
                      {inq.message}
                    </p>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <span className="text-[11px] font-mono text-slate-400">
                      {mounted ? formatTime(inq.receivedAt) : "..."}
                    </span>
                    {inq.unread ? (
                      <button
                        onClick={() => markInquiryRead(inq.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
                      >
                        Mark as Read
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Read</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
