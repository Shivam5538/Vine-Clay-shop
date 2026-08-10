import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-vine-and-clay.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key"
  );
}

/**
 * Singleton Browser Supabase Client instance for client components.
 */
export const supabaseClient = createClient();

