import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

export const DEFAULT_SUPABASE_URL = "https://iisimtqcplpqnnijtxpf.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY =
  "sb_publishable_O0fpWNztYn01I1tGXh_ZQA_E81pWKmT";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  DEFAULT_SUPABASE_URL;

// Gunakan SECRET_KEY di server jika ada (bypass RLS bucket), atau PUBLISHABLE_KEY / ANON_KEY
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Browser client khusus untuk otentikasi client-side (Google OAuth dsb)
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient(url, key);
}

