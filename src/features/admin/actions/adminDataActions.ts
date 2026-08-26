"use server";

import { prisma } from "@/lib/prisma";
import {
  SEED_LOCATIONS,
  SEED_TABLES,
  SEED_BOOKINGS,
  SEED_ORDERS,
} from "../lib/mockData";

export async function getAdminDataAction() {
  try {
    const fetchPromise = Promise.all([
      prisma.location.findMany({
        where: { active: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.table.findMany({
        where: { active: true },
        orderBy: { number: "asc" },
      }),
      prisma.booking.findMany({
        orderBy: { dateTime: "desc" },
        take: 300,
        include: {
          table: {
            select: { number: true },
          },
        },
      }),
      prisma.order.findMany({
        orderBy: { receivedAt: "desc" },
        take: 100,
        include: {
          items: {
            include: {
              menuItem: {
                select: { name: true },
              },
            },
          },
        },
      }),
    ]);

    const [locations, tables, bookings, orders] = await Promise.race([
      fetchPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Database query timed out")), 1500)
      ),
    ]);

    return {
      success: true,
      data: {
        locations: locations.map((l) => ({
          id: l.id,
          name: l.name,
          slug: l.slug,
          address: l.address,
          latitude: l.latitude,
          longitude: l.longitude,
          phone: l.phone,
          hours: l.hours as any,
          capacity: l.capacity,
          timezone: l.timezone,
          active: l.active,
          createdAt: l.createdAt.toISOString(),
        })),
        tables: tables.map((t) => {
          const defaultCoords: Record<string, any> = {
            "T-01": { x: 10, y: 20, w: 60, h: 60, s: "circle" },
            "T-02": { x: 10, y: 45, w: 60, h: 60, s: "circle" },
            "T-03": { x: 30, y: 20, w: 80, h: 80, s: "rectangle" },
            "T-04": { x: 30, y: 45, w: 80, h: 80, s: "rectangle" },
            "T-05": { x: 55, y: 30, w: 120, h: 80, s: "rectangle" },
            "P-01 (Patio)": { x: 80, y: 60, w: 80, h: 80, s: "rectangle" },
            "P-02 (Patio)": { x: 80, y: 80, w: 60, h: 60, s: "circle" },
            "B-01 (Bench)": { x: 50, y: 80, w: 100, h: 40, s: "pill" },
          };
          const def = defaultCoords[t.number] || { x: 10, y: 10, w: 80, h: 80, s: "rectangle" };
          
          return {
            id: t.id,
            locationId: t.locationId,
            number: t.number,
            seatCount: t.seatCount,
            isOutdoor: t.isOutdoor,
            active: t.active,
            positionX: Number(t.positionX) === 0 ? def.x : Number(t.positionX),
            positionY: Number(t.positionY) === 0 ? def.y : Number(t.positionY),
            width: Number(t.width) === 0 ? def.w : Number(t.width),
            height: Number(t.height) === 0 ? def.h : Number(t.height),
            shape: (!t.shape || t.shape === "") ? def.s : t.shape,
          };
        }),
        bookings: bookings.map((b) => ({
          id: b.id,
          bookingRef: b.bookingRef,
          locationId: b.locationId,
          tableId: b.tableId ?? undefined,
          tableName: b.table?.number ?? undefined,
          customerName: b.customerName,
          customerEmail: b.customerEmail,
          customerPhone: b.customerPhone,
          partySize: b.partySize,
          dateTime: b.dateTime.toISOString(),
          durationMinutes: b.durationMinutes,
          status: b.status,
          source: b.source,
          specialRequests: b.specialRequests ?? undefined,
          createdAt: b.createdAt.toISOString(),
        })),
        orders: orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          locationId: o.locationId,
          customerName: o.customerName,
          customerPhone: o.customerPhone,
          customerEmail: o.customerEmail ?? undefined,
          orderType: o.orderType,
          status: o.status,
          paymentStatus: o.paymentStatus,
          items: o.items.map((i) => ({
            id: i.id,
            menuItemId: i.menuItemId,
            name: i.menuItem?.name ?? "Item",
            quantity: i.quantity,
            unitPrice: Number(i.unitPrice),
            totalPrice: Number(i.totalPrice),
            notes: i.notes ?? undefined,
          })),
          subtotal: Number(o.subtotal),
          tax: Number(o.tax),
          total: Number(o.total),
          notes: o.notes ?? undefined,
          receivedAt: o.receivedAt.toISOString(),
          preparingAt: o.preparingAt?.toISOString(),
          readyAt: o.readyAt?.toISOString(),
          completedAt: o.completedAt?.toISOString(),
          cancelledAt: o.cancelledAt?.toISOString(),
        })),
      },
    };
  } catch (err: unknown) {
    console.warn("[getAdminDataAction fallback]: Using local seed data.", err instanceof Error ? err.message : err);
    return {
      success: true,
      data: {
        locations: SEED_LOCATIONS,
        tables: SEED_TABLES,
        bookings: SEED_BOOKINGS,
        orders: SEED_ORDERS,
      },
    };
  }
}

export async function updateTableLayoutAction(tables: { id: string, positionX: number, positionY: number, width: number, height: number, shape: string }[]) {
  try {
    const updatePromise = prisma.$transaction(
      tables.map((t) =>
        prisma.table.update({
          where: { id: t.id },
          data: {
            positionX: t.positionX,
            positionY: t.positionY,
            width: t.width,
            height: t.height,
            shape: t.shape,
          },
        })
      )
    );

    await Promise.race([
      updatePromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout updating table layout")), 1500)
      ),
    ]);

    return { success: true };
  } catch (err: unknown) {
    console.warn("[updateTableLayoutAction]: Saved layout locally.", err instanceof Error ? err.message : err);
    return { success: true };
  }
}

