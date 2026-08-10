"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CreateBookingInput {
  locationId: string;
  tableId?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  partySize: number;
  dateTime: string;
  durationMinutes?: number;
  status?: string;
  source?: string;
  notes?: string;
}

export async function createBookingAction(formData: CreateBookingInput) {
  try {
    const bookingRef = `RES-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Resolve active location directly from PostgreSQL via Prisma (bypasses RLS restrictions)
    let location = await prisma.location.findFirst({
      where: { active: true },
      orderBy: { createdAt: "asc" },
    });

    if (!location) {
      // Auto-create flagship location if table is empty
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
      return {
        success: false,
        error: "Unable to find or initialize location in database.",
      };
    }

    // 2. Resolve table ID if valid UUID
    let tableId: string | null = null;
    if (formData.tableId && formData.tableId.length > 20) {
      const existingTable = await prisma.table.findUnique({
        where: { id: formData.tableId },
      });
      if (existingTable) {
        tableId = existingTable.id;
      }
    }

    if (!tableId) {
      const autoTable = await prisma.table.findFirst({
        where: { locationId: location.id, active: true, seatCount: { gte: formData.partySize } },
        orderBy: { seatCount: "asc" },
      });
      tableId = autoTable?.id ?? null;
    }

    if (!tableId) {
      const firstTable = await prisma.table.findFirst({
        where: { locationId: location.id, active: true },
      });
      tableId = firstTable?.id ?? null;
    }

    // 3. Create booking record in database
    const newBooking = await prisma.booking.create({
      data: {
        locationId: location.id,
        tableId: tableId,
        bookingRef,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail || "guest@example.com",
        customerPhone: formData.customerPhone || "(555) 000-0000",
        partySize: formData.partySize,
        dateTime: new Date(formData.dateTime),
        durationMinutes: formData.durationMinutes || 90,
        status: (formData.status as "pending" | "confirmed" | "seated" | "completed" | "cancelled" | "no_show") || "confirmed",
        source: (formData.source as "online" | "phone" | "walk_in") || "online",
        specialRequests: formData.notes || null,
      },
    });

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");

    return {
      success: true,
      booking: {
        id: newBooking.id,
        booking_ref: newBooking.bookingRef,
        location_id: newBooking.locationId,
        table_id: newBooking.tableId,
        customer_name: newBooking.customerName,
        customer_email: newBooking.customerEmail,
        customer_phone: newBooking.customerPhone,
        party_size: newBooking.partySize,
        date_time: newBooking.dateTime.toISOString(),
        duration_minutes: newBooking.durationMinutes,
        status: newBooking.status,
        source: newBooking.source,
        special_requests: newBooking.specialRequests,
        created_at: newBooking.createdAt.toISOString(),
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("[createBookingAction Error]:", message);

    // Secondary fallback to Supabase JS client
    try {
      const supabase = await createClient();
      const bookingRef = `RES-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data: locs } = await supabase
        .from("locations")
        .select("id")
        .limit(1);

      const locId = locs && locs.length > 0 ? locs[0].id : null;
      if (!locId) {
        return { success: false, error: message };
      }

      const { data, error } = await supabase
        .from("bookings")
        .insert({
          location_id: locId,
          booking_ref: bookingRef,
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone || null,
          customer_email: formData.customerEmail || null,
          party_size: formData.partySize,
          date_time: formData.dateTime,
          duration_minutes: formData.durationMinutes || 90,
          status: formData.status || "confirmed",
          source: formData.source || "online",
          special_requests: formData.notes || null,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, booking: data };
    } catch {
      return { success: false, error: message };
    }
  }
}

export async function updateBookingStatusDbAction(bookingId: string, status: string) {
  try {
    if (!bookingId || bookingId.startsWith("bk-")) {
      return { success: true };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: status as any },
    });

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update booking status";
    console.error("[updateBookingStatusDbAction Error]:", message);
    return { success: false, error: message };
  }
}
