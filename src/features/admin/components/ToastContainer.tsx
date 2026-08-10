"use client";

import React from "react";
import { useAdminStore } from "../store/useAdminStore";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";

export function ToastContainer() {
  const toasts = useAdminStore((state) => state.toasts);
  const removeToast = useAdminStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icon =
          toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#6B7548] shrink-0 mt-0.5" />
          ) : toast.type === "error" ? (
            <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          ) : toast.type === "warning" ? (
            <AlertTriangle className="w-4 h-4 text-[#C1633B] shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-[#C1633B] shrink-0 mt-0.5" />
          );

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border border-[#E8DFD5] bg-white text-[#33241A] shadow-lg transition-all duration-200 animate-in slide-in-from-bottom-3"
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold font-mono text-[#33241A]">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-[#66584C] mt-0.5 font-sans leading-normal">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#8C7B6E] hover:text-[#33241A] p-0.5 rounded transition-colors"
              title="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

