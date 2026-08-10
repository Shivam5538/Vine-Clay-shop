import React from "react";
import Link from "next/link";
import { LucideIcon, ChevronRight } from "lucide-react";

export interface QuickActionRowProps {
  label: string;
  subtext?: string;
  icon: LucideIcon;
  bgSolid: string; // e.g. 'bg-blue-600'
  isFeatured?: boolean;
  href?: string;
  onClick?: () => void;
}

export function QuickActionRow({
  label,
  subtext,
  icon: Icon,
  bgSolid,
  isFeatured = false,
  href,
  onClick,
}: QuickActionRowProps) {
  const content = (
    <div
      onClick={onClick}
      className={`rounded-xl p-4 border transition-all duration-200 flex items-center justify-between group ${
        isFeatured
          ? "bg-orange-50/70 border-orange-200/80 hover:border-orange-300 shadow-xs"
          : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs"
      } ${href || onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Icon Badge */}
        <div
          className={`w-10 h-10 rounded-lg ${bgSolid} text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">
            {label}
          </h4>
          {subtext && (
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
              {subtext}
            </p>
          )}
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
