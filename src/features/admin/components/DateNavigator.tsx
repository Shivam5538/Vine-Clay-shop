import React from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, parseISO, addDays, subDays } from "date-fns";

export interface DateNavigatorProps {
  selectedDate: string; // ISO format "YYYY-MM-DD"
  onDateChange: (newDate: string) => void;
}

export function DateNavigator({ selectedDate, onDateChange }: DateNavigatorProps) {
  const currentDate = parseISO(selectedDate);
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const isToday = selectedDate === todayStr;

  const handlePrevDay = () => {
    const prev = subDays(currentDate, 1);
    onDateChange(format(prev, "yyyy-MM-dd"));
  };

  const handleNextDay = () => {
    const next = addDays(currentDate, 1);
    onDateChange(format(next, "yyyy-MM-dd"));
  };

  const handleToday = () => {
    onDateChange(todayStr);
  };

  return (
    <div className="flex items-center gap-2 font-sans">
      {/* Prev Day Button */}
      <button
        onClick={handlePrevDay}
        className="p-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 rounded-xl transition-all shadow-xs shrink-0 active:scale-95"
        title="Previous Day"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Today Shortcut Button */}
      <button
        onClick={handleToday}
        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs border ${
          isToday
            ? "bg-purple-50 text-purple-700 border-purple-200 font-bold"
            : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50"
        }`}
      >
        Today
      </button>

      {/* Compact Date Display / Picker */}
      <div className="relative flex items-center">
        <label className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-900 cursor-pointer shadow-xs transition-all">
          <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
          <span className="font-mono">{format(currentDate, "EEE, MMM d, yyyy")}</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && onDateChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
      </div>

      {/* Next Day Button */}
      <button
        onClick={handleNextDay}
        className="p-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 rounded-xl transition-all shadow-xs shrink-0 active:scale-95"
        title="Next Day"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
