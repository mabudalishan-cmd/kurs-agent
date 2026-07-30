import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase environment variables are missing. NEXT_PUBLIC_SUPABASE_URL və NEXT_PUBLIC_SUPABASE_ANON_KEY-i .env.local faylında əlavə edin."
  );
}

/**
 * Browser (client-side) Supabase client — @supabase/ssr ilə cookie əsaslı auth.
 * Login/logout əməliyyatları üçün istifadə olunur.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-side Supabase client (service role).
 * Server komponentlərində məlumat çəkmək üçün istifadə olunur.
 * Service role key brauzerə göndərilmir (yalnız serverdə).
 */
export function createServerSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY environment variable is missing."
    );
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}