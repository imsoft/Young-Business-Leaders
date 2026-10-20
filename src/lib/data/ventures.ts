import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { MemberVenture } from "@/lib/types";

/** Emprendimientos de uno o varios perfiles. Si la tabla aún no existe (migración pendiente) devuelve []. */
export async function getVentures(profileIds: string[]): Promise<MemberVenture[]> {
  if (profileIds.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("member_ventures")
    .select("*")
    .in("profile_id", profileIds)
    .order("sort_order")
    .order("created_at");
  if (error) return [];
  return data ?? [];
}

/** IDs de perfiles con algún emprendimiento en la industria dada (para el filtro del directorio). */
export async function profileIdsByVentureIndustry(industry: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("member_ventures").select("profile_id").eq("industry", industry).limit(1000);
  if (error) return [];
  return [...new Set((data ?? []).map((v) => v.profile_id))];
}

export type VentureOwner = { id: string; full_name: string; avatar_url: string | null; headline: string | null };
export type VentureWithOwner = MemberVenture & { owner: VentureOwner | null };

const WITH_OWNER = "*, owner:profiles!member_ventures_profile_id_fkey(id, full_name, avatar_url, headline)";

/** Un emprendimiento con quien lo registró. RLS decide si el usuario puede verlo. */
export async function getVentureWithOwner(id: string): Promise<VentureWithOwner | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("member_ventures").select(WITH_OWNER).eq("id", id).maybeSingle();
  if (error || !data) return null;
  return data as unknown as VentureWithOwner;
}

/** Directorio de emprendimientos. `q` ya viene saneado (sanitizeSearch). */
export async function listVentures({ q, industry, stage }: { q?: string; industry?: string; stage?: MemberVenture["stage"] }): Promise<VentureWithOwner[]> {
  const supabase = await createClient();
  let query = supabase.from("member_ventures").select(WITH_OWNER).order("name").limit(300);
  if (industry) query = query.eq("industry", industry);
  if (stage) query = query.eq("stage", stage);
  if (q) query = query.or(`name.ilike.%${q}%,tagline.ilike.%${q}%`);
  const { data, error } = await query;
  if (error) return [];
  // Solo de miembros con perfil visible (aprobados); RLS ya filtra, esto descarta huérfanos.
  return ((data ?? []) as unknown as VentureWithOwner[]).filter((v) => v.owner);
}
