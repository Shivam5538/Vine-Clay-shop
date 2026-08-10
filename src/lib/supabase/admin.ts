import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Privileged Admin Supabase Client using Service Role Key.
 * NEVER import this file in client-side components.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-vine-and-clay.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "mock-service-role-key",
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

export const supabaseAdmin = createAdminClient();

