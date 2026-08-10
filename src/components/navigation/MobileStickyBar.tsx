"use client";

import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export function MobileStickyBar() {
  const { openCart, openReservation, getTotalItems } = useCartStore();
  const [visible, setVisible] = useState(false);
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past hero (~350px)
      setVisible(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden flex items-center gap-2 p-2 bg-[#33241A]/95 backdrop-blur-md text-[#FBF6EF] rounded-full shadow-2xl border border-[#D9BFA0]/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={openReservation}
        className="flex-1 py-3 px-4 rounded-full bg-[#FBF6EF]/10 hover:bg-[#FBF6EF]/20 text-xs font-mono uppercase tracking-wider text-[#FBF6EF] flex items-center justify-center gap-2 transition-colors"
      >
        <Calendar className="w-3.5 h-3.5 text-[#C1633B]" />
        Book Table
      </button>

      <button
        onClick={openCart}
        className="flex-1 py-3 px-4 rounded-full bg-[#C1633B] hover:bg-[#a8522d] text-xs font-mono uppercase tracking-wider text-[#FBF6EF] font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        Order Online ({totalItems})
      </button>
    </div>
  );
}
