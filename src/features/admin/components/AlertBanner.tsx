import React from "react";
import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

export interface AlertBannerProps {
  headline: string;
  description: string;
  pillLabel?: string;
  buttonText: string;
  buttonHref: string;
  icon: LucideIcon;
  bgWash?: string; // e.g. 'bg-blue-50/80 border-blue-100'
  iconBgSolid?: string; // e.g. 'bg-blue-600'
  buttonBgSolid?: string; // e.g. 'bg-blue-600 hover:bg-blue-700'
  pillBgSolid?: string; // e.g. 'bg-blue-600'
}

export function AlertBanner({
  headline,
  description,
  pillLabel = "NEEDS ATTENTION",
  buttonText,
  buttonHref,
  icon: Icon,
  bgWash = "bg-blue-50/80 border-blue-100",
  iconBgSolid = "bg-blue-600",
  buttonBgSolid = "bg-blue-600 hover:bg-blue-700",
  pillBgSolid = "bg-blue-600",
}: AlertBannerProps) {
  return (
    <div
      className={`w-full rounded-2xl p-5 border ${bgWash} flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs`}
    >
      <div className="flex items-start gap-3.5 min-w-0">
        {/* Colored circular icon badge */}
        <div
          className={`w-10 h-10 rounded-full ${iconBgSolid} text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              {headline}
            </h3>
            {pillLabel && (
              <span
                className={`text-[10px] font-mono uppercase font-bold text-white px-2.5 py-0.5 rounded-full ${pillBgSolid}`}
              >
                {pillLabel}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <Link
        href={buttonHref}
        className={`px-4 py-2.5 ${buttonBgSolid} text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shrink-0 shadow-xs active:scale-[0.98] self-end md:self-auto`}
      >
        <span>{buttonText}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
