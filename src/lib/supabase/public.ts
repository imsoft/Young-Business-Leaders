import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./env";
import type { Database } from "@/lib/types";

/** Cliente anónimo sin cookies. Úsalo dentro de `use cache` para datos públicos. */
export function createPublicClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
