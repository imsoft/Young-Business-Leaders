"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { profileSchema, fieldErrors, type FieldErrors } from "@/lib/validation";

export type ProfileState = { errors?: FieldErrors; message?: string; ok?: boolean } | undefined;

const MAX_AVATAR_BYTES = 3 * 1024 * 1024;

export async function updateProfile(_: ProfileState, formData: FormData): Promise<ProfileState> {
  const profile = await requireProfile("/comunidad/perfil");
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const supabase = await createClient();
  let avatar_url: string | undefined;

  const file = formData.get("avatar");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) return { errors: { avatar: "Sube una imagen" } };
    if (file.size > MAX_AVATAR_BYTES) return { errors: { avatar: "Máximo 3 MB" } };
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${profile.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { contentType: file.type, upsert: true });
    if (error) return { message: "No se pudo subir la foto." };
    avatar_url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
  }

  const { error } = await supabase
    .from("profiles")
    .update({ ...parsed.data, ...(avatar_url ? { avatar_url } : {}) })
    .eq("id", profile.id);
  if (error) return { message: "No se pudo guardar. Intenta de nuevo." };

  revalidatePath("/comunidad", "layout");
  return { ok: true };
}
