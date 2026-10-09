export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True cuando hay URL y anon key. Sin esto el sitio corre con datos vacíos. */
export function hasSupabaseEnv() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
