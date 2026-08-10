import React from "react";
import { LucideIcon } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  bgSolid: string; // e.g. 'bg-blue-600'
  delta?: string; // e.g. '+3 today'
  subtext?: string;
  hasUnreadBadge?: boolean;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  bgSolid,
  delta,
  subtext,
  hasUnreadBadge,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-6 border border-slate-100 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] flex flex-col justify-between transition-all duration-200 ${
        onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-4">
        {/* 44x44px solid color rounded-square badge */}
        <div className="relative">
          <div
            className={`w-11 h-11 rounded-lg ${bgSolid} text-white flex items-center justify-center shrink-0 shadow-xs`}
          >
            <Icon className="w-5.5 h-5.5" />
          </div>
          {hasUnreadBadge && (
            <span className="w-3 h-3 bg-red-500 border-2 border-white rounded-full absolute -top-1 -right-1 animate-pulse" />
          )}
        </div>

        {/* Optional Delta Pill */}
        {delta && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100/80">
            {delta}
          </span>
        )}
      </div>

      <div>
        <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
          {value}
        </div>
        <div className="text-xs md:text-sm text-slate-500 font-medium mt-1">
          {label}
        </div>
        {subtext && (
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
}
