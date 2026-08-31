"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Store,
  Receipt,
  ShoppingBag,
  Copy,
  Check,
  Coffee,
  ArrowRight,
  Flame,
} from "lucide-react";
import Image from "next/image";

export function OrderSuccessModal() {
  const { isOrderSuccessOpen, closeOrderSuccess, lastPlacedOrder } = useCartStore();
  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti effects upon opening
  useEffect(() => {
    if (isOrderSuccessOpen) {
      // Primary burst
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.5, x: 0.5 },
        colors: ["#C1633B", "#6B7548", "#D9BFA0", "#33241A", "#E8DFD5"],
        disableForReducedMotion: true,
      });

      // Side fireworks burst
      const timer1 = setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.65 },
          colors: ["#C1633B", "#D9BFA0", "#D48B60"],
          disableForReducedMotion: true,
        });
      }, 250);

      const timer2 = setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.65 },
          colors: ["#6B7548", "#C1633B", "#FBF6EF"],
          disableForReducedMotion: true,
        });
      }, 400);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOrderSuccessOpen]);

  if (!lastPlacedOrder) return null;

  const handleCopyOrderNumber = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(lastPlacedOrder.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOrderSuccessOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
          {/* Backdrop with rich ceramic blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOrderSuccess}
            className="fixed inset-0 bg-[#33241A]/70 backdrop-blur-md transition-all"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 320,
            }}
            className="relative w-full max-w-xl bg-[#FBF6EF] text-[#33241A] rounded-3xl shadow-[0_25px_60px_-15px_rgba(51,36,26,0.35)] border border-[#D9BFA0]/60 overflow-hidden z-10 my-8"
          >
            {/* Top Decorative Gradient Ribbon */}
            <div className="h-2 w-full bg-linear-to-r from-[#C1633B] via-[#D9BFA0] to-[#6B7548]" />

            {/* Close Button */}
            <button
              onClick={closeOrderSuccess}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-[#33241A]/70 hover:text-[#33241A] border border-[#D9BFA0]/40 transition-colors shadow-xs z-20"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto space-y-6">
              {/* Animated Header Badge & Icon */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  {/* Glowing pulse aura */}
                  <motion.div
                    animate={{
                      scale: [1, 1.25, 1],
                      opacity: [0.35, 0.7, 0.35],
                    }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -inset-2 rounded-full bg-[#C1633B]/20 blur-sm"
                  />

                  {/* Stamp Seal Circle */}
                  <div className="relative w-18 h-18 rounded-full bg-linear-to-br from-[#C1633B] to-[#9E4822] text-[#FBF6EF] flex items-center justify-center shadow-lg border-2 border-[#FBF6EF]">
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                    </motion.div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C1633B]/10 border border-[#C1633B]/20 text-[#C1633B] text-[11px] font-mono font-semibold uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C1633B] animate-ping" />
                  Order Confirmed & Sent to Barista
                </div>

                <h2 className="font-fraunces text-2xl sm:text-3xl font-bold tracking-tight text-[#33241A] leading-tight">
                  Slow-Crafted with Care
                </h2>
                <p className="text-xs sm:text-sm text-[#33241A]/75 mt-1 max-w-sm">
                  Thank you, <span className="font-semibold text-[#33241A]">{lastPlacedOrder.customerName}</span>. Your ticket has been received in our live workshop.
                </p>

                {/* Order Token Box */}
                <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 bg-white rounded-xl border border-[#D9BFA0]/50 shadow-xs">
                  <span className="text-[11px] font-mono text-[#8C7B6E]">Order Reference:</span>
                  <span className="font-mono font-bold text-xs text-[#C1633B] tracking-wide">
                    {lastPlacedOrder.orderNumber}
                  </span>
                  <button
                    onClick={handleCopyOrderNumber}
                    className="p-1 text-[#8C7B6E] hover:text-[#33241A] hover:bg-[#FBF6EF] rounded transition-colors"
                    title="Copy Order ID"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Live Preparation Stage Tracker */}
              <div className="bg-white rounded-2xl p-4 border border-[#D9BFA0]/40 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#8C7B6E] pb-2 border-b border-[#D9BFA0]/20">
                  <span className="font-semibold uppercase tracking-wider text-[#33241A]">Workshop Status</span>
                  <span className="text-[#C1633B] flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> Ready in {lastPlacedOrder.estimatedTime}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#6B7548]/10 border border-[#6B7548]/20">
                    <div className="w-6 h-6 rounded-full bg-[#6B7548] text-white flex items-center justify-center text-[10px] font-bold mb-1 shadow-xs">
                      ✓
                    </div>
                    <span className="text-[11px] font-semibold text-[#6B7548]">Received</span>
                    <span className="text-[9px] font-mono text-[#33241A]/50">Order In</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#C1633B]/10 border border-[#C1633B]/30 relative overflow-hidden">
                    <div className="w-6 h-6 rounded-full bg-[#C1633B] text-white flex items-center justify-center text-[10px] font-bold mb-1 shadow-xs animate-pulse">
                      <Flame className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#C1633B]">Slow Crafting</span>
                    <span className="text-[9px] font-mono text-[#C1633B]/80 font-medium">In Kitchen</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#FBF6EF] border border-[#D9BFA0]/30 opacity-70">
                    <div className="w-6 h-6 rounded-full bg-[#D9BFA0]/40 text-[#8C7B6E] flex items-center justify-center text-[10px] font-bold mb-1">
                      {lastPlacedOrder.orderType === "delivery" ? <Truck className="w-3.5 h-3.5" /> : <Coffee className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[11px] font-semibold text-[#33241A]/70">
                      {lastPlacedOrder.orderType === "delivery" ? "Dispatch" : "Hand-off"}
                    </span>
                    <span className="text-[9px] font-mono text-[#33241A]/50">Upcoming</span>
                  </div>
                </div>
              </div>

              {/* Delivery / Location Overview */}
              <div className="bg-white rounded-2xl p-4 border border-[#D9BFA0]/40 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FBF6EF] border border-[#D9BFA0]/50 flex items-center justify-center text-[#C1633B] shrink-0 mt-0.5">
                  {lastPlacedOrder.orderType === "delivery" ? (
                    <Truck className="w-5 h-5" />
                  ) : (
                    <Store className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-fraunces font-semibold text-sm text-[#33241A]">
                      {lastPlacedOrder.orderType === "delivery"
                        ? "Artisanal Home Delivery"
                        : "Counter Pick-up Location"}
                    </h3>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-[#FBF6EF] border border-[#D9BFA0]/40 text-[#8C7B6E]">
                      {lastPlacedOrder.orderType}
                    </span>
                  </div>

                  <p className="text-xs text-[#33241A]/80 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C1633B] shrink-0" />
                    <span className="truncate">
                      {lastPlacedOrder.orderType === "delivery"
                        ? lastPlacedOrder.deliveryAddress || "Customer Address"
                        : `${lastPlacedOrder.locationName} (${lastPlacedOrder.locationAddress})`}
                    </span>
                  </p>

                  <p className="text-[11px] font-mono text-[#8C7B6E] mt-1">
                    Contact: {lastPlacedOrder.customerPhone}
                  </p>
                </div>
              </div>

              {/* Itemized Receipt Preview */}
              <div className="bg-white rounded-2xl p-4 border border-[#D9BFA0]/40 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#8C7B6E] font-semibold border-b border-[#D9BFA0]/20 pb-2">
                  <span className="flex items-center gap-1.5 text-[#33241A]">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C1633B]" /> Bag Summary
                  </span>
                  <span>{lastPlacedOrder.items.reduce((acc, i) => acc + i.quantity, 0)} Items</span>
                </div>

                <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
                  {lastPlacedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.image && (
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-[#FBF6EF] shrink-0 border border-[#D9BFA0]/30">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                        )}
                        <div className="truncate">
                          <span className="font-medium text-[#33241A] block truncate">{item.name}</span>
                          <span className="text-[11px] font-mono text-[#8C7B6E]">
                            Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-[#33241A] shrink-0 ml-2">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Breakdown */}
                <div className="pt-3 border-t border-[#D9BFA0]/30 space-y-1 text-xs font-mono text-[#33241A]/75">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${lastPlacedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span>${lastPlacedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[#33241A] pt-1.5 border-t border-[#D9BFA0]/30">
                    <span className="font-fraunces text-base font-bold">Total Paid</span>
                    <span className="text-[#C1633B] font-mono text-base font-bold">
                      ${lastPlacedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handlePrintReceipt}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-full bg-white hover:bg-[#FBF6EF] text-[#33241A] font-medium text-xs border border-[#D9BFA0]/60 transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Receipt className="w-4 h-4 text-[#8C7B6E]" />
                  <span>Print Digital Receipt</span>
                </button>

                <button
                  onClick={closeOrderSuccess}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-full bg-[#C1633B] hover:bg-[#a8522d] text-[#FBF6EF] font-medium text-xs transition-all shadow-md flex items-center justify-center gap-2 group"
                >
                  <span>Continue Exploring</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
