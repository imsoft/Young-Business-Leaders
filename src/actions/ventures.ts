"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { processUpload, UNSUPPORTED_IMAGE } from "@/lib/images";
import { fieldErrors, ventureSchema, type FieldErrors } from "@/lib/validation";
import { MAX_VENTURES } from "@/lib/constants";

export type VentureState = { errors?: FieldErrors; message?: string; ok?: boolean } | undefined;

const MAX_LOGO_BYTES = 3 * 1024 * 1024;
const CONTACT_COLUMNS = ["contact_phone", "contact_whatsapp", "contact_email", "instagram", "facebook", "linkedin", "tiktok"] as const;
type ContactKey = (typeof CONTACT_COLUMNS)[number];
// Tabla o columnas aún no creadas (migración pendiente)
const MISSING_TABLE = new Set(["42P01", "PGRST205", "PGRST204"]);

function refresh(profileId: string) {
  revalidatePath("/comunidad/perfil");
  revalidatePath(`/comunidad/${profileId}`);
  revalidatePath("/comunidad");
}

/** Crea o edita un emprendimiento propio. RLS garantiza que solo se toquen los del usuario. */
export async function saveVenture(_: VentureState, formData: FormData): Promise<VentureState> {
  const profile = await requireProfile("/comunidad/perfil");
  const parsed = ventureSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const supabase = await createClient();
  const id = formData.get("id");
  const isEdit = typeof id === "string" && id.length > 0;

  let logo_url: string | undefined;
  const file = formData.get("logo");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_LOGO_BYTES) return { errors: { logo: "Máximo 3 MB" } };
    const img = await processUpload(file, { max: 256, square: true });
    if (!img || img.ext === "svg") return { errors: { logo: UNSUPPORTED_IMAGE } };
    const path = `${profile.id}/ventures/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
    const { error } = await supabase.storage.from("avatars").upload(path, img.data, { contentType: img.contentType, cacheControl: "31536000" });
    if (error) return { message: "No se pudo subir el logo." };
    logo_url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
  }
  if (formData.get("remove_logo") === "on") logo_url = undefined;

  const payload = {
    ...parsed.data,
    ...(logo_url ? { logo_url } : {}),
    ...(formData.get("remove_logo") === "on" ? { logo_url: null } : {}),
  };

  // Si la migración de contacto (20261021) aún no corre, se guarda sin esas columnas.
  const write = async (data: typeof payload | Omit<typeof payload, ContactKey>) => {
    if (isEdit) return supabase.from("member_ventures").update(data).eq("id", id).eq("profile_id", profile.id);
    return supabase.from("member_ventures").insert({ ...data, profile_id: profile.id, sort_order: count ?? 0 });
  };
  let count: number | null = null;
  if (!isEdit) {
    ({ count } = await supabase.from("member_ventures").select("id", { count: "exact", head: true }).eq("profile_id", profile.id));
    if ((count ?? 0) >= MAX_VENTURES) return { message: `Puedes registrar hasta ${MAX_VENTURES} emprendimientos.` };
  }
  let { error } = await write(payload);
  if (error?.code === "PGRST204") {
    const withoutContact = Object.fromEntries(Object.entries(payload).filter(([k]) => !CONTACT_COLUMNS.includes(k as ContactKey)));
    ({ error } = await write(withoutContact as Omit<typeof payload, ContactKey>));
  }
  if (error) return { message: MISSING_TABLE.has(error.code) ? "Esta función aún no está activa." : "No se pudo guardar." };
  refresh(profile.id);
  return { ok: true };
}

export async function deleteVenture(id: string) {
  const profile = await requireProfile("/comunidad/perfil");
  const supabase = await createClient();
  await supabase.from("member_ventures").delete().eq("id", id).eq("profile_id", profile.id);
  refresh(profile.id);
}

/** Lo pone primero: es el que aparece en la tarjeta del directorio. */
export async function makePrimaryVenture(id: string) {
  const profile = await requireProfile("/comunidad/perfil");
  const supabase = await createClient();
  const { data } = await supabase.from("member_ventures").select("id").eq("profile_id", profile.id).order("sort_order").order("created_at");
  const ordered = [id, ...(data ?? []).map((v) => v.id).filter((v) => v !== id)];
  await Promise.all(
    ordered.map((vid, i) => supabase.from("member_ventures").update({ sort_order: i }).eq("id", vid).eq("profile_id", profile.id)),
  );
  refresh(profile.id);
}
