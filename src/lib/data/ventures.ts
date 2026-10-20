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
