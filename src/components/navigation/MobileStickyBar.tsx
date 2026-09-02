"use client";

import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileStickyBar() {
  const { openCart, getTotalItems, getSubtotal } = useCartStore();
  const totalItems = getTotalItems();
  const subtotal = getSubtotal();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.aside
          aria-label="Mobile cart preview"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed bottom-5 inset-x-4 max-w-sm mx-auto z-40 sm:hidden"
        >
          <button
            onClick={openCart}
            className="w-full py-3.5 px-5 rounded-full bg-[#33241A] text-[#FBF6EF] border border-[#C1633B]/40 shadow-2xl shadow-black/40 flex items-center justify-between gap-3 active:scale-[0.98] transition-transform cursor-pointer"
          >
            {/* Left: Cart Icon with Bouncing Badge */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full bg-[#C1633B] flex items-center justify-center text-white shadow-sm">
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-white text-[#C1633B] font-mono text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              </div>
              <div className="text-left">
                <p className="font-mono text-xs uppercase tracking-wider text-[#FBF6EF]">
                  View Cart
                </p>
                <p className="font-mono text-[11px] text-[#D9BFA0]">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            {/* Right: Subtotal & Arrow */}
            <div className="flex items-center gap-2">
              <span className="font-fraunces text-base font-semibold text-[#FBF6EF]">
                ${subtotal.toFixed(2)}
              </span>
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#FBF6EF]">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
