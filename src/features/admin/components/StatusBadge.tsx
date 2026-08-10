import React from "react";
import { OrderStatus, BookingStatus, OrderType, PaymentStatus } from "../types/admin";

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  if (["received", "preparing", "pending"].includes(normalized)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#FFF4F0] text-[#E05628] border border-[#FFDDD2]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E05628] animate-pulse" />
        <span className="capitalize">{status.replaceAll("_", " ")}</span>
      </span>
    );
  }

  if (["ready", "confirmed", "seated", "paid", "completed"].includes(normalized)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
        <span className="capitalize">{status.replaceAll("_", " ")}</span>
      </span>
    );
  }

  if (["cancelled", "error", "no_show"].includes(normalized)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
        <span className="capitalize">{status.replaceAll("_", " ")}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#FAFAFA] text-[#71717A] border border-[#E4E4E7]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#71717A]" />
      <span className="capitalize">{status.replaceAll("_", " ")}</span>
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, { bg: string; text: string; border: string; dot: string }> = {
    received: { bg: "bg-[#FFF4F0]", text: "text-[#E05628]", border: "border-[#FFDDD2]", dot: "bg-[#E05628]" },
    preparing: { bg: "bg-[#FFF4F0]", text: "text-[#E05628]", border: "border-[#FFDDD2]", dot: "bg-[#E05628]" },
    ready: { bg: "bg-[#F0FDF4]", text: "text-[#16A34A]", border: "border-[#DCFCE7]", dot: "bg-[#16A34A]" },
    completed: { bg: "bg-[#FAFAFA]", text: "text-[#71717A]", border: "border-[#E4E4E7]", dot: "bg-[#71717A]" },
    cancelled: { bg: "bg-[#FEF2F2]", text: "text-[#DC2626]", border: "border-[#FEE2E2]", dot: "bg-[#DC2626]" },
  };

  const labels: Record<OrderStatus, string> = {
    received: "Received",
    preparing: "Preparing",
    ready: "Ready for Pickup",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const st = styles[status] || styles.completed;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${st.bg} ${st.text} ${st.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${status === "received" || status === "preparing" ? "animate-pulse" : ""}`} />
      {labels[status]}
    </span>
  );
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, { bg: string; text: string; border: string; dot: string }> = {
    pending: { bg: "bg-[#FFF4F0]", text: "text-[#E05628]", border: "border-[#FFDDD2]", dot: "bg-[#E05628]" },
    confirmed: { bg: "bg-[#F0FDF4]", text: "text-[#16A34A]", border: "border-[#DCFCE7]", dot: "bg-[#16A34A]" },
    seated: { bg: "bg-[#F0FDF4]", text: "text-[#16A34A]", border: "border-[#DCFCE7]", dot: "bg-[#16A34A]" },
    completed: { bg: "bg-[#FAFAFA]", text: "text-[#71717A]", border: "border-[#E4E4E7]", dot: "bg-[#71717A]" },
    cancelled: { bg: "bg-[#FEF2F2]", text: "text-[#DC2626]", border: "border-[#FEE2E2]", dot: "bg-[#DC2626]" },
    no_show: { bg: "bg-[#FEF2F2]", text: "text-[#DC2626]", border: "border-[#FEE2E2]", dot: "bg-[#DC2626]" },
  };

  const labels: Record<BookingStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    seated: "Seated Now",
    completed: "Finished",
    cancelled: "Cancelled",
    no_show: "No-Show",
  };

  const st = styles[status] || styles.completed;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${st.bg} ${st.text} ${st.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${status === "pending" ? "animate-pulse" : ""}`} />
      {labels[status]}
    </span>
  );
}

export function OrderTypeBadge({ type }: { type: OrderType }) {
  const labels: Record<OrderType, string> = {
    dine_in: "Dine-In",
    pickup: "Counter Pickup",
    delivery: "Delivery",
  };

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] rounded text-xs font-mono font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
      {labels[type]}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const isPaid = status === "paid";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-xs font-mono uppercase font-semibold ${
        isPaid
          ? "text-[#16A34A] bg-[#F0FDF4] border-[#DCFCE7]"
          : "text-[#71717A] bg-[#FAFAFA] border-[#E4E4E7]"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-[#16A34A]" : "bg-[#71717A]"}`} />
      {status}
    </span>
  );
}
