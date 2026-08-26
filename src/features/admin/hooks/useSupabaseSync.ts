"use client";

import { useEffect, useRef } from "react";
import { useAdminStore } from "@/features/admin/store/useAdminStore";
import { getAdminDataAction } from "@/features/admin/actions/adminDataActions";
import { supabaseClient } from "@/lib/supabase/client";

export function useSupabaseSync() {
  const hydrateFromSupabase = useAdminStore((s) => s.hydrateFromSupabase);
  const isLoaded = useAdminStore((s) => s.isLoaded);
  const isRealtimeEnabled = useAdminStore((s) => s.isRealtimeEnabled);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    async function syncData() {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      try {
        const res = await getAdminDataAction();
        if (res.success && res.data) {
          hydrateFromSupabase({
            locations: res.data.locations,
            tables: res.data.tables,
            bookings: res.data.bookings as any,
            orders: res.data.orders as any,
          });
        }
      } catch (err) {
        console.warn("[useSupabaseSync] Sync error:", err);
      } finally {
        isSyncingRef.current = false;
      }
    }

    // Initial Hydration
    if (!isLoaded) {
      syncData();
    }

    // Realtime Polling & Supabase Channel Listener when Live Sync is Enabled
    if (!isRealtimeEnabled) return;

    // 1. Periodic Polling Interval (every 15s, only if tab is visible)
    const intervalId = setInterval(() => {
      if (typeof document !== "undefined" && !document.hidden) {
        syncData();
      }
    }, 15000);

    // 2. Supabase Realtime Subscription Channel (with safety catch)
    let channel: any = null;
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("mock-")) {
        channel = supabaseClient
          .channel("admin_realtime_sync")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "orders" },
            () => {
              syncData();
            }
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "bookings" },
            () => {
              syncData();
            }
          )
          .subscribe();
      }
    } catch {
      // Ignore realtime connection errors in offline/local mode
    }

    return () => {
      clearInterval(intervalId);
      if (channel) {
        try {
          supabaseClient.removeChannel(channel);
        } catch {}
      }
    };
  }, [isLoaded, isRealtimeEnabled, hydrateFromSupabase]);
}

