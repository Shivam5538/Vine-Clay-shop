"use client";

import { useSupabaseSync } from "@/features/admin/hooks/useSupabaseSync";

/**
 * AdminDataLoader — Invisible client component that lives in the admin layout.
 * Triggers Supabase hydration of the Zustand store on first mount.
 * Renders nothing — purely a side-effect component.
 */
export function AdminDataLoader() {
  useSupabaseSync();
  return null;
}
