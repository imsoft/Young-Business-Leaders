import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { Profile } from "@/lib/types";

/**
 * Capa de acceso a datos de sesión. Lee cookies, así que todo lo que la llame
 * debe vivir detrás de un <Suspense> (cacheComponents).
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return data ?? null;
}

/** Exige sesión. Si no hay, manda a login conservando el destino. */
export async function requireProfile(next?: string): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  return profile;
}

/** Exige miembro aprobado. Pendientes y rechazados van a /pendiente. */
export async function requireMember(next?: string): Promise<Profile> {
  const profile = await requireProfile(next);
  if (profile.status !== "approved" && !profile.is_admin) redirect("/pendiente");
  return profile;
}

export async function requireAdmin(): Promise<Profile> {
  const profile = await requireProfile("/admin");
  if (!profile.is_admin) redirect("/comunidad");
  return profile;
}
