"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CreateOrderInput {
  locationId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType?: "dine_in" | "pickup" | "delivery";
  items: Array<{
    menuItemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  notes?: string;
}

export async function createOrderAction(input: CreateOrderInput) {
  try {
    const subtotal = input.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const tax = subtotal * 0.08875;
    const total = subtotal + tax;
    const orderNumber = `VC-${Math.floor(9000 + Math.random() * 1000)}`;

    // 1. Resolve active location via Prisma (bypasses RLS)
    let location = await prisma.location.findFirst({
      where: { active: true },
      orderBy: { createdAt: "asc" },
    });

    if (!location) {
      location = await prisma.location.create({
        data: {
          name: "Vine & Clay — Flagship Ceramic Studio & Cafe",
          slug: "downtown-flagship",
          address: "412 Mercantile Way, Soho Quarter, NY 10012",
          latitude: 40.7241,
          longitude: -73.9982,
          phone: "(212) 555-0182",
          capacity: 48,
          timezone: "America/New_York",
          active: true,
          hours: {
            monday: { open: "07:00", close: "18:00" },
            tuesday: { open: "07:00", close: "18:00" },
            wednesday: { open: "07:00", close: "18:00" },
            thursday: { open: "07:00", close: "19:00" },
            friday: { open: "07:00", close: "20:00" },
            saturday: { open: "08:00", close: "20:00" },
            sunday: { open: "08:00", close: "18:00" },
          },
        },
      });
    }

    if (!location) {
      return { success: false, error: "No active location found in database." };
    }

    // 2. Insert order via Prisma
    const newOrder = await prisma.order.create({
      data: {
        locationId: location.id,
        orderNumber,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail || null,
        orderType: (input.orderType as "dine_in" | "pickup" | "delivery") || "pickup",
        status: "received",
        paymentStatus: "paid",
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        notes: input.notes || null,
      },
    });

    // 3. Insert order items if provided
    if (input.items && input.items.length > 0) {
      for (const item of input.items) {
        // Resolve menu item ID if valid or fallback
        let menuItemId = item.menuItemId;
        if (!menuItemId || menuItemId.length < 20) {
          const firstMenuItem = await prisma.menuItem.findFirst();
          if (firstMenuItem) {
            menuItemId = firstMenuItem.id;
          }
        }

        if (menuItemId && menuItemId.length > 20) {
          await prisma.orderItem.create({
            data: {
              orderId: newOrder.id,
              menuItemId,
              quantity: item.quantity,
              unitPrice: item.unitPrice.toFixed(2),
              totalPrice: (item.unitPrice * item.quantity).toFixed(2),
            },
          });
        }
      }
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return {
      success: true,
      order: {
        id: newOrder.id,
        order_number: newOrder.orderNumber,
        location_id: newOrder.locationId,
        customer_name: newOrder.customerName,
        customer_phone: newOrder.customerPhone,
        customer_email: newOrder.customerEmail,
        order_type: newOrder.orderType,
        status: newOrder.status,
        payment_status: newOrder.paymentStatus,
        subtotal: Number(newOrder.subtotal),
        tax: Number(newOrder.tax),
        total: Number(newOrder.total),
        created_at: newOrder.receivedAt.toISOString(),
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[createOrderAction Error]:", message);
    return { success: false, error: message };
  }
}

export async function updateOrderStatusDbAction(orderId: string, status: string) {
  try {
    if (!orderId || orderId.startsWith("ord-")) {
      return { success: true };
    }

    const now = new Date();
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status as any,
        ...(status === "preparing" ? { preparingAt: now } : {}),
        ...(status === "ready" ? { readyAt: now } : {}),
        ...(status === "completed" ? { completedAt: now } : {}),
        ...(status === "cancelled" ? { cancelledAt: now } : {}),
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update order status";
    console.error("[updateOrderStatusDbAction Error]:", message);
    return { success: false, error: message };
  }
}
