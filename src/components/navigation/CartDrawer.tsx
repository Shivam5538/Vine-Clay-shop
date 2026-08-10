"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAdminStore } from "@/features/admin/store/useAdminStore";
import { createOrderAction } from "@/features/admin/actions/orderActions";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Check,
  AlertCircle,
  MapPin,
  Truck,
  Store,
  User,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import Image from "next/image";

export function CartDrawer() {
  const { isCartOpen, closeCart, items, updateQuantity, removeItem, getSubtotal, clearCart, addToast } =
    useCartStore();

  const locations = useAdminStore((s) => s.locations);

  // Form State
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const subtotal = getSubtotal();
  const tax = subtotal * 0.08875;
  const total = subtotal + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage("Please enter your name and phone number to complete the order.");
      return;
    }

    if (orderType === "delivery" && !deliveryAddress.trim()) {
      setErrorMessage("Please enter your delivery address.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build combined notes with delivery address if applicable
      const combinedNotes = orderType === "delivery"
        ? `[Delivery Address: ${deliveryAddress.trim()}] ${specialNotes.trim()}`.trim()
        : specialNotes.trim();

      const chosenLocId = selectedLocationId || (locations[0]?.id ?? "");

      const result = await createOrderAction({
        locationId: chosenLocId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        orderType,
        notes: combinedNotes || undefined,
        items: items.map((i) => ({
          menuItemId: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          unitPrice: i.product.price,
        })),
      });

      setIsSubmitting(false);

      if (!result.success) {
        setErrorMessage(result.error || "Failed to place order. Please try again.");
        return;
      }

      setIsSuccess(true);
      addToast(
        orderType === "delivery"
          ? `Delivery order placed! We'll dispatch to ${customerName}.`
          : `Order placed! Pick up at ${locations.find((l) => l.id === chosenLocId)?.name || "Vine & Clay Cafe"}.`,
        "success"
      );

      setTimeout(() => {
        clearCart();
        setIsSuccess(false);
        setCustomerName("");
        setCustomerPhone("");
        setCustomerEmail("");
        setDeliveryAddress("");
        setSpecialNotes("");
        closeCart();
      }, 2500);
    } catch (err) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : "Checkout failed. Please try again.";
      setErrorMessage(msg);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#33241A] z-50 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg bg-[#FBF6EF] text-[#33241A] shadow-2xl flex flex-col justify-between border-l border-[#D9BFA0]/40 font-sans"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#D9BFA0]/30 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#C1633B]" />
                <div>
                  <h2 className="text-lg font-fraunces font-bold tracking-tight text-[#33241A]">Your Craft Bag</h2>
                  <p className="text-[11px] font-mono text-[#8C7B6E]">Specify pickup or delivery location details</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-[#33241A]/60 hover:text-[#33241A] hover:bg-[#33241A]/5 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#33241A]/60 py-16">
                  <div className="w-16 h-16 rounded-full bg-[#D9BFA0]/20 flex items-center justify-center mb-4 text-[#C1633B]">
                    <ShoppingBag className="w-8 h-8 opacity-60" />
                  </div>
                  <p className="font-fraunces text-lg text-[#33241A]">Your bag is unhurriedly empty</p>
                  <p className="text-xs mt-1 max-w-xs text-[#33241A]/60">
                    Add single-origin beans, stoneground matcha, or hand-thrown ceramics to begin.
                  </p>
                </div>
              ) : (
                <>
                  {/* Items List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#8C7B6E] font-semibold">
                      Bag Items ({items.reduce((acc, i) => acc + i.quantity, 0)})
                    </h3>
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-3.5 p-3 bg-white rounded-xl border border-[#D9BFA0]/30 shadow-xs"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#FBF6EF] shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-xs text-[#33241A] leading-tight">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => removeItem(item.product.id)}
                                className="text-[#33241A]/40 hover:text-[#C1633B] p-1 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-xs font-mono text-[#C1633B] mt-0.5">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-1.5 bg-[#FBF6EF] rounded border border-[#D9BFA0]/40 px-2 py-0.5">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="text-[#33241A]/70 hover:text-[#33241A]"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-xs w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="text-[#33241A]/70 hover:text-[#33241A]"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-[10px] font-mono text-[#33241A]/50 uppercase">
                              ${item.product.price.toFixed(2)} ea
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer & Location Form */}
                  <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4 pt-2 border-t border-[#D9BFA0]/30">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#8C7B6E] font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C1633B]" />
                      Fulfillment & Customer Location
                    </h3>

                    {/* Order Type Toggle */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-white border border-[#D9BFA0]/40 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setOrderType("pickup")}
                        className={`py-2 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                          orderType === "pickup"
                            ? "bg-[#33241A] text-white shadow-xs"
                            : "text-[#66584C] hover:bg-[#FBF6EF]"
                        }`}
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>Cafe Pickup</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType("delivery")}
                        className={`py-2 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                          orderType === "delivery"
                            ? "bg-[#33241A] text-white shadow-xs"
                            : "text-[#66584C] hover:bg-[#FBF6EF]"
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Studio Delivery</span>
                      </button>
                    </div>

                    {/* Location or Delivery Address Input */}
                    {orderType === "pickup" ? (
                      <div>
                        <label className="block text-xs font-semibold text-[#33241A] mb-1">
                          Select Cafe Pickup Location <span className="text-[#C1633B]">*</span>
                        </label>
                        <select
                          value={selectedLocationId}
                          onChange={(e) => setSelectedLocationId(e.target.value)}
                          className="w-full bg-white border border-[#D9BFA0]/60 rounded-lg p-2.5 text-xs text-[#33241A] focus:outline-none focus:border-[#C1633B]"
                        >
                          {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name} ({loc.address})
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-[#33241A] mb-1">
                          Delivery Address & Suite/Apt <span className="text-[#C1633B]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 142 Mercer St, Apt 4B, Soho, NY 10012"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full bg-white border border-[#D9BFA0]/60 rounded-lg p-2.5 text-xs text-[#33241A] focus:outline-none focus:border-[#C1633B]"
                        />
                      </div>
                    )}

                    {/* Guest Contact Info */}
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="block text-xs font-semibold text-[#33241A] mb-1 flex items-center gap-1">
                          <User className="w-3 h-3 text-[#8C7B6E]" />
                          Full Name <span className="text-[#C1633B]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Eleanor Vance"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-white border border-[#D9BFA0]/60 rounded-lg p-2 text-xs text-[#33241A] focus:outline-none focus:border-[#C1633B]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-[#33241A] mb-1 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#8C7B6E]" />
                            Phone Number <span className="text-[#C1633B]">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="(555) 019-2831"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full bg-white border border-[#D9BFA0]/60 rounded-lg p-2 text-xs font-mono text-[#33241A] focus:outline-none focus:border-[#C1633B]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#33241A] mb-1 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-[#8C7B6E]" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="eleanor@example.com"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="w-full bg-white border border-[#D9BFA0]/60 rounded-lg p-2 text-xs text-[#33241A] focus:outline-none focus:border-[#C1633B]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#33241A] mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-[#8C7B6E]" />
                          Special Instructions / Preparation Notes
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Extra hot oat milk, fragile ceramic wrapping..."
                          value={specialNotes}
                          onChange={(e) => setSpecialNotes(e.target.value)}
                          className="w-full bg-white border border-[#D9BFA0]/60 rounded-lg p-2 text-xs text-[#33241A] focus:outline-none focus:border-[#C1633B]"
                        />
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Footer / Checkout Button */}
            {items.length > 0 && (
              <div className="p-5 bg-white border-t border-[#D9BFA0]/30 space-y-3 shrink-0">
                {errorMessage && (
                  <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-1 font-mono text-xs text-[#33241A]/70">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8.875%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[#33241A] pt-1.5 border-t border-[#D9BFA0]/30">
                    <span>Total</span>
                    <span className="text-[#C1633B]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting || isSuccess}
                  className="w-full py-3.5 rounded-full bg-[#C1633B] hover:bg-[#a8522d] text-[#FBF6EF] font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-75"
                >
                  {isSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Order Placed & Sent to Admin!</span>
                    </>
                  ) : isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-[#FBF6EF] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Checkout (${total.toFixed(2)})</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
