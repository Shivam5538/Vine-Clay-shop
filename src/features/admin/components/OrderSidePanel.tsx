"use client";

import React, { useState, useEffect } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { OrderStatusBadge, PaymentStatusBadge, OrderTypeBadge } from "./StatusBadge";
import { formatTime } from "@/lib/format-date";
import {
  X,
  Clock,
  User,
  Phone,
  Mail,
  ChevronRight,
  AlertCircle,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { OrderStatus } from "../types/admin";

export function OrderSidePanel() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    orders,
    selectedOrderId,
    setSelectedOrderId,
    updateOrderStatus,
    activityLogs,
  } = useAdminStore();

  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!selectedOrderId) return null;

  const order = orders.find((o) => o.id === selectedOrderId);
  if (!order) return null;

  const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
    received: "preparing",
    preparing: "ready",
    ready: "completed",
    completed: null,
    cancelled: null,
  };

  const nextStatus = nextStatusMap[order.status];

  const handleAdvance = () => {
    if (nextStatus) {
      updateOrderStatus(order.id, nextStatus);
    }
  };

  const handleConfirmCancel = () => {
    updateOrderStatus(order.id, "cancelled");
    setShowCancelModal(false);
  };

  const orderLogs = activityLogs.filter(
    (l) => l.entityType === "order" && l.entityId === order.id
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#33241A]/40 backdrop-blur-xs transition-opacity duration-250 ease-out"
      onClick={() => setSelectedOrderId(null)}
    >
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col font-sans border-l border-[#E8DFD5] transition-transform duration-250 ease-out transform translate-x-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-[#E8DFD5] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-lg text-[#C1633B]">{order.orderNumber}</span>
            <OrderStatusBadge status={order.status} />
            <OrderTypeBadge type={order.orderType} />
          </div>
          <button
            onClick={() => setSelectedOrderId(null)}
            className="p-1.5 text-[#8C7B6E] hover:text-[#33241A] hover:bg-[#FBF6EF] rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-[#FAF8F5] border-b border-[#E8DFD5] flex items-center justify-between gap-3">
          {nextStatus ? (
            <button
              onClick={handleAdvance}
              className="flex-1 bg-[#C1633B] hover:bg-[#a9532f] text-white py-2.5 px-4 rounded-md text-xs font-semibold font-mono flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>Advance Status to</span>
              <span className="uppercase font-bold underline decoration-white/40">{nextStatus}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-[#6B7548] bg-[#FAF8F5] px-3 py-2 rounded-md border border-[#6B7548]/30 flex-1">
              <span className="w-2 h-2 rounded-full bg-[#6B7548]" />
              <span>Order reached terminal status ({order.status.toUpperCase()}).</span>
            </div>
          )}

          {order.status !== "completed" && order.status !== "cancelled" && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-3 py-2.5 text-xs font-mono text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors font-medium flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cancel Order</span>
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Customer & Location Metadata */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#FAF8F5] border border-[#E8DFD5] rounded-md">
            <div>
              <span className="text-[10px] font-mono text-[#8C7B6E] uppercase tracking-wider block mb-1">
                Customer & Fulfillment Location
              </span>
              <p className="text-sm font-semibold text-[#33241A] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C1633B]" />
                {order.customerName}
              </p>
              <p className="text-xs font-mono text-[#66584C] flex items-center gap-1.5 mt-1 tabular-nums">
                <Phone className="w-3.5 h-3.5 text-[#8C7B6E]" />
                {order.customerPhone}
              </p>
              {order.customerEmail && (
                <p className="text-xs font-mono text-[#66584C] flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#8C7B6E]" />
                  {order.customerEmail}
                </p>
              )}
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#8C7B6E] uppercase tracking-wider block mb-1">
                Fulfillment & Payment
              </span>
              <div className="flex items-center gap-2 mb-2">
                <OrderTypeBadge type={order.orderType} />
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
              <p className="text-xs font-mono text-[#66584C] flex items-center gap-1.5 tabular-nums">
                <Clock className="w-3.5 h-3.5 text-[#8C7B6E]" />
                Received: {mounted ? formatTime(order.receivedAt) : "..."}
              </p>
            </div>
          </div>

          {/* Location & Delivery Notes Banner */}
          {order.notes && (
            <div className="p-3 bg-[#FBF6EF] border border-[#C1633B]/30 rounded-md flex items-start gap-2 text-xs text-[#33241A]">
              <AlertCircle className="w-4 h-4 text-[#C1633B] shrink-0 mt-0.5" />
              <div>
                <span className="font-mono font-bold uppercase tracking-wider block text-[10px] text-[#C1633B]">Fulfillment & Location Notes:</span>
                <p className="mt-0.5 font-sans font-medium">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Line Items Table */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#8C7B6E] font-semibold mb-2">
              Order Line Items ({order.items.length})
            </h3>
            <div className="border border-[#E8DFD5] rounded-md overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E8DFD5] text-[10px] font-mono text-[#66584C] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFD5] text-[#33241A] font-sans">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-2.5 px-3 font-medium">
                        {item.name}
                        {item.notes && (
                          <span className="block text-[11px] font-mono text-[#C1633B] mt-0.5">
                            Note: {item.notes}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold tabular-nums">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#66584C] tabular-nums">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#33241A] tabular-nums">${item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Summary */}
              <div className="p-3 bg-[#FAF8F5] border-t border-[#E8DFD5] space-y-1 text-xs font-mono text-right">
                <div className="flex justify-between text-[#66584C]">
                  <span>Subtotal:</span>
                  <span className="tabular-nums">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#66584C]">
                  <span>Tax (8.875%):</span>
                  <span className="tabular-nums">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#33241A] pt-1.5 border-t border-[#E8DFD5]">
                  <span>Grand Total:</span>
                  <span className="text-[#C1633B] tabular-nums">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit History */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#8C7B6E] font-semibold mb-2">
              Audit Trail History
            </h3>
            <div className="border border-[#E8DFD5] rounded-md p-3 bg-[#FAF8F5] space-y-2 max-h-36 overflow-y-auto">
              {orderLogs.length === 0 ? (
                <p className="text-xs font-mono text-[#8C7B6E] italic">No audit log entries yet.</p>
              ) : (
                orderLogs.map((log) => (
                  <div key={log.id} className="text-xs font-mono border-b border-[#E8DFD5] pb-1.5 last:border-0 last:pb-0">
                    <div className="flex justify-between text-[#8C7B6E] text-[10px]">
                      <span className="font-semibold text-[#33241A]">{log.userName} ({log.userRole})</span>
                      <span className="tabular-nums">{mounted ? formatTime(log.timestamp) : "..."}</span>
                    </div>
                    <p className="text-[#66584C] font-sans mt-0.5">{log.details}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8DFD5] bg-white flex justify-end">
          <button
            onClick={() => setSelectedOrderId(null)}
            className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#FBF6EF] border border-[#E8DFD5] text-[#33241A] text-xs font-mono font-medium rounded-md transition-colors"
          >
            Close Drawer (Esc)
          </button>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-[#33241A]/50 backdrop-blur-xs flex items-center justify-center p-4 z-60">
          <div className="bg-white border border-red-200 rounded-lg p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#33241A]">Cancel Order #{order.orderNumber}</h3>
                <p className="text-xs text-[#66584C] mt-1">
                  Are you sure you want to cancel this order for <strong className="text-[#33241A]">{order.customerName}</strong>?
                </p>
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-900 leading-relaxed font-sans">
                  <strong>Consequence:</strong> This will trigger an automatic refund of ${order.total.toFixed(2)} to {order.customerName}&apos;s original payment method and remove it from the active kitchen queue.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8DFD5]">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-3.5 py-2 border border-[#E8DFD5] text-[#33241A] rounded-md text-xs font-medium hover:bg-[#FAF8F5]"
              >
                Keep Order Active
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold shadow-xs"
              >
                Confirm Cancel & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
