import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  hasPublicSupabaseConfig,
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "@/lib/supabase/public-env";

/**
 * Returns true when Supabase public credentials are available (env or built-in fallback).
 * Used by pages to decide whether to read from Supabase or fall back to static data.
 */
export function isSupabaseConfigured(): boolean {
  return hasPublicSupabaseConfig();
}

/**
 * Server-side Supabase client (Server Components, Route Handlers, Server Actions).
 * In Next.js 16 `cookies()` is async, so this helper is async too.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if middleware refreshes user sessions.
          }
        },
      },
    }
  );
}
