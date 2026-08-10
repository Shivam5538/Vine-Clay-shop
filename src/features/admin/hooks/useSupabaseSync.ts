"use client";

import { useEffect } from "react";
import { useAdminStore } from "@/features/admin/store/useAdminStore";
import { getAdminDataAction } from "@/features/admin/actions/adminDataActions";
import { supabaseClient } from "@/lib/supabase/client";

export function useSupabaseSync() {
  const hydrateFromSupabase = useAdminStore((s) => s.hydrateFromSupabase);
  const isLoaded = useAdminStore((s) => s.isLoaded);
  const isRealtimeEnabled = useAdminStore((s) => s.isRealtimeEnabled);

  useEffect(() => {
    async function syncData() {
      const res = await getAdminDataAction();
      if (res.success && res.data) {
        hydrateFromSupabase({
          locations: res.data.locations,
          tables: res.data.tables,
          bookings: res.data.bookings as any,
          orders: res.data.orders as any,
        });
      }
    }

    // Initial Hydration
    if (!isLoaded) {
      syncData();
    }

    // Realtime Polling & Supabase Channel Listener when Live Sync is Enabled
    if (!isRealtimeEnabled) return;

    // 1. Periodic Polling Interval (every 5s)
    const intervalId = setInterval(() => {
      syncData();
    }, 5000);

    // 2. Supabase Realtime Subscription Channel
    const channel = supabaseClient
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

    return () => {
      clearInterval(intervalId);
      supabaseClient.removeChannel(channel);
    };
  }, [isLoaded, isRealtimeEnabled, hydrateFromSupabase]);
}
