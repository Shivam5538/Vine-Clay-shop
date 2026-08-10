import React from "react";
import { LucideIcon } from "lucide-react";

export interface ActivityItemProps {
  subject: string;
  description: string;
  timestamp: string;
  icon: LucideIcon;
  bgSolid: string; // e.g. 'bg-purple-600'
}

export function ActivityItem({
  subject,
  description,
  timestamp,
  icon: Icon,
  bgSolid,
}: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      {/* Small colored icon circle */}
      <div
        className={`w-7 h-7 rounded-full ${bgSolid} text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-800 leading-snug">
          <strong className="font-semibold text-slate-900">{subject}</strong>{" "}
          <span className="text-slate-600">{description}</span>
        </p>
        <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
          {timestamp}
        </span>
      </div>
    </div>
  );
}
