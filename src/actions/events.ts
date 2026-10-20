"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireMember } from "@/lib/auth";
import { guestRegistrationSchema, fieldErrors, type FieldErrors } from "@/lib/validation";
import { isPastEvent } from "@/lib/format";
import { TURNSTILE_FAILED, verifyTurnstile } from "@/lib/turnstile";
import { after } from "next/server";
import { sendEmail } from "@/lib/email/send";
import { eventRegistrationEmail } from "@/lib/email/messages";
import type { Event } from "@/lib/types";

export type RegistrationState =
  | { errors?: FieldErrors; message?: string; ok?: boolean; already?: boolean }
  | undefined;

/** Registro de un miembro aprobado a un evento (pasa por RLS). */
export async function registerMember(eventId: string, slug: string) {
  const profile = await requireMember(`/eventos/${slug}`);
  const supabase = await createClient();
  const { data: event } = await supabase.from("events").select("*").eq("id", eventId).maybeSingle();
  if (!event || isPastEvent(event, Date.now())) return { message: "Este evento ya terminó." };
  const { error } = await supabase
    .from("event_registrations")
    .insert({ event_id: eventId, user_id: profile.id });
  if (error && error.code !== "23505") {
    return { message: "No pudimos registrarte. Intenta de nuevo." };
  }
  // Solo en el primer registro (23505 = ya estaba registrado)
  if (!error && profile.email) {
    const mail = eventRegistrationEmail(event as Event, profile.full_name || null, profile.email);
    after(() => sendEmail(mail));
  }
  revalidatePath(`/eventos/${slug}`);
  revalidatePath("/comunidad/eventos");
  return { ok: true };
}

export async function unregisterMember(eventId: string, slug: string) {
  const profile = await requireMember(`/eventos/${slug}`);
  const supabase = await createClient();
  await supabase
    .from("event_registrations")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", profile.id);
  revalidatePath(`/eventos/${slug}`);
  revalidatePath("/comunidad/eventos");
  return { ok: true };
}

/** Registro de invitado (sin cuenta). Valida en servidor y escribe con service role. */
export async function registerGuest(_: RegistrationState, formData: FormData): Promise<RegistrationState> {
  // honeypot
  if (formData.get("website")) return { ok: true };

  const parsed = guestRegistrationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response")))) return { message: TURNSTILE_FAILED };

  const admin = createAdminClient();
  const { data: event } = await admin
    .from("events")
    .select("*")
    .eq("id", parsed.data.event_id)
    .maybeSingle();
  if (!event || !event.published || !event.is_public) {
    return { message: "Este evento no acepta registros públicos." };
  }
  if (isPastEvent(event, Date.now())) return { message: "Este evento ya terminó." };
  if (event.capacity) {
    const { data: count } = await admin.rpc("event_attendee_count", { event: event.id });
    if ((count ?? 0) >= event.capacity) return { message: "El cupo está lleno." };
  }

  const guestEmail = parsed.data.guest_email.toLowerCase();
  const { error } = await admin.from("event_registrations").insert({
    event_id: event.id,
    guest_name: parsed.data.guest_name,
    guest_email: guestEmail,
  });
  if (error?.code === "23505") return { ok: true, already: true };
  if (error) return { message: "No pudimos registrarte. Intenta de nuevo." };
  const mail = eventRegistrationEmail(event as Event, parsed.data.guest_name, guestEmail);
  after(() => sendEmail(mail));

  revalidatePath(`/eventos/${event.slug}`);
  return { ok: true };
}
