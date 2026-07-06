import { createBrowserClient } from "@supabase/ssr";
import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "@/lib/supabase/public-env";

/**
 * Browser-side Supabase client (Client Components).
 * Reads credentials from NEXT_PUBLIC_* env vars, which are safe to expose to the browser.
 */
export function createClient() {
  return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}
