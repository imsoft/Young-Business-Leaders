"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { TAGS } from "@/lib/data/public";
import { localDateTimeToIso } from "@/lib/format";
import {
  albumSchema,
  eventSchema,
  sponsorSchema,
  fieldErrors,
  formBool,
  type FieldErrors,
} from "@/lib/validation";
import type { MemberStatus } from "@/lib/types";
import { processUpload, uploadName, UNSUPPORTED_IMAGE } from "@/lib/images";

export type AdminState = { errors?: FieldErrors; message?: string; ok?: boolean } | undefined;

const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

async function uploadImage(folder: string, file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) return { url: undefined as string | undefined };
  if (!file.type.startsWith("image/")) return { error: "Sube una imagen" };
  if (file.size > MAX_IMAGE_BYTES) return { error: "Máximo 6 MB por imagen" };
  const img = await processUpload(file);
  if (!img) return { error: UNSUPPORTED_IMAGE };
  const path = `${folder}/${uploadName(img)}`;
  const admin = createAdminClient();
  const { error } = await admin.storage
    .from("media")
    .upload(path, img.data, { contentType: img.contentType, cacheControl: "31536000" });
  if (error) return { error: "No se pudo subir la imagen" };
  return { url: admin.storage.from("media").getPublicUrl(path).data.publicUrl };
}

// ---------- Miembros ----------
export async function setMemberStatus(userId: string, status: MemberStatus) {
  await requireAdmin();
  await createAdminClient().from("profiles").update({ status }).eq("id", userId);
  revalidatePath("/admin/miembros");
  revalidatePath("/comunidad", "layout");
}

export async function setMemberAdmin(userId: string, isAdmin: boolean) {
  const me = await requireAdmin();
  if (me.id === userId && !isAdmin) return; // no te quites admin a ti mismo
  await createAdminClient().from("profiles").update({ is_admin: isAdmin }).eq("id", userId);
  revalidatePath("/admin/miembros");
}

// ---------- Eventos ----------
function parseEvent(formData: FormData) {
  return eventSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    starts_at: formData.get("starts_at"),
    ends_at: formData.get("ends_at"),
    location: formData.get("location"),
    address: formData.get("address"),
    capacity: formData.get("capacity"),
    is_public: formBool(formData.get("is_public")),
    published: formBool(formData.get("published")),
  });
}

export async function saveEvent(_: AdminState, formData: FormData): Promise<AdminState> {
  const me = await requireAdmin();
  const parsed = parseEvent(formData);
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const upload = await uploadImage("events", formData.get("cover"));
  if (upload.error) return { errors: { cover: upload.error } };

  const id = formData.get("id");
  const payload = {
    ...parsed.data,
    starts_at: localDateTimeToIso(parsed.data.starts_at)!,
    ends_at: localDateTimeToIso(parsed.data.ends_at ?? ""),
    ...(upload.url ? { cover_url: upload.url } : {}),
  };
  const admin = createAdminClient();
  const result =
    typeof id === "string" && id
      ? await admin.from("events").update(payload).eq("id", id).select("id").single()
      : await admin.from("events").insert({ ...payload, created_by: me.id }).select("id").single();
  if (result.error) {
    return {
      message: result.error.code === "23505" ? "Ya existe un evento con ese slug." : "No se pudo guardar.",
    };
  }
  updateTag(TAGS.events);
  revalidatePath("/admin/eventos");
  redirect(`/admin/eventos/${result.data.id}?saved=1`);
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  await createAdminClient().from("events").delete().eq("id", id);
  updateTag(TAGS.events);
  revalidatePath("/admin/eventos");
  redirect("/admin/eventos");
}

// ---------- Galería ----------
export async function saveAlbum(_: AdminState, formData: FormData): Promise<AdminState> {
  await requireAdmin();
  const parsed = albumSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    event_date: formData.get("event_date"),
    sort_order: formData.get("sort_order") || 0,
    published: formBool(formData.get("published")),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const upload = await uploadImage("albums", formData.get("cover"));
  if (upload.error) return { errors: { cover: upload.error } };

  const id = formData.get("id");
  const payload = { ...parsed.data, ...(upload.url ? { cover_url: upload.url } : {}) };
  const admin = createAdminClient();
  const result =
    typeof id === "string" && id
      ? await admin.from("gallery_albums").update(payload).eq("id", id).select("id").single()
      : await admin.from("gallery_albums").insert(payload).select("id").single();
  if (result.error) {
    return {
      message: result.error.code === "23505" ? "Ya existe un álbum con ese slug." : "No se pudo guardar.",
    };
  }
  updateTag(TAGS.gallery);
  revalidatePath("/admin/galeria");
  redirect(`/admin/galeria/${result.data.id}?saved=1`);
}

export async function deleteAlbum(id: string) {
  await requireAdmin();
  await createAdminClient().from("gallery_albums").delete().eq("id", id);
  updateTag(TAGS.gallery);
  redirect("/admin/galeria");
}

export async function addPhotos(albumId: string, _: AdminState, formData: FormData): Promise<AdminState> {
  await requireAdmin();
  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { errors: { photos: "Selecciona al menos una foto" } };
  const admin = createAdminClient();
  const rows: { album_id: string; url: string; sort_order: number }[] = [];
  for (const [i, file] of files.entries()) {
    const upload = await uploadImage(`albums/${albumId}`, file);
    if (upload.error) return { errors: { photos: upload.error } };
    if (upload.url) rows.push({ album_id: albumId, url: upload.url, sort_order: Date.now() + i });
  }
  const { error } = await admin.from("gallery_photos").insert(rows);
  if (error) return { message: "No se pudieron guardar las fotos." };
  updateTag(TAGS.gallery);
  revalidatePath(`/admin/galeria/${albumId}`);
  return { ok: true };
}

export async function deletePhoto(photoId: string, albumId: string) {
  await requireAdmin();
  await createAdminClient().from("gallery_photos").delete().eq("id", photoId);
  updateTag(TAGS.gallery);
  revalidatePath(`/admin/galeria/${albumId}`);
}

// ---------- Patrocinadores ----------
export async function saveSponsor(_: AdminState, formData: FormData): Promise<AdminState> {
  await requireAdmin();
  const parsed = sponsorSchema.safeParse({
    name: formData.get("name"),
    website: formData.get("website"),
    tier: formData.get("tier"),
    sort_order: formData.get("sort_order") || 0,
    active: formBool(formData.get("active")),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const upload = await uploadImage("sponsors", formData.get("logo"));
  if (upload.error) return { errors: { logo: upload.error } };

  const id = formData.get("id");
  const payload = { ...parsed.data, ...(upload.url ? { logo_url: upload.url } : {}) };
  const admin = createAdminClient();
  const { error } =
    typeof id === "string" && id
      ? await admin.from("sponsors").update(payload).eq("id", id)
      : await admin.from("sponsors").insert(payload);
  if (error) return { message: "No se pudo guardar." };
  updateTag(TAGS.sponsors);
  revalidatePath("/admin/patrocinadores");
  return { ok: true };
}

export async function deleteSponsor(id: string) {
  await requireAdmin();
  await createAdminClient().from("sponsors").delete().eq("id", id);
  updateTag(TAGS.sponsors);
  revalidatePath("/admin/patrocinadores");
}
