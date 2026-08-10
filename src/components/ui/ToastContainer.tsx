"use client";

import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useCartStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 0.98, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-[#33241A] text-[#FBF6EF] rounded-2xl shadow-lg border border-[#D9BFA0]/20 text-sm font-sans"
          >
            <div className="flex items-center gap-2.5">
              {toast.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-[#C1633B] shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-[#6B7548] shrink-0" />
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#D9BFA0] hover:text-[#FBF6EF] p-1 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
