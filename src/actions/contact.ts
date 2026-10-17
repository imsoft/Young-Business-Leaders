"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { contactSchema, fieldErrors, type FieldErrors } from "@/lib/validation";
import { TURNSTILE_FAILED, verifyTurnstile } from "@/lib/turnstile";

export type ContactState = { errors?: FieldErrors; message?: string; ok?: boolean } | undefined;

export async function sendContact(_: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response")))) return { message: TURNSTILE_FAILED };
  const { name, email, message } = parsed.data;
  const admin = createAdminClient();
  // Freno simple: máximo 3 mensajes por correo por hora.
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("email", email.toLowerCase())
    .gte("created_at", since);
  if ((count ?? 0) >= 3) return { message: "Ya recibimos tus mensajes. Te responderemos pronto." };
  const { error } = await admin.from("contact_messages").insert({ name, email: email.toLowerCase(), message });
  if (error) return { message: "No se pudo enviar. Escríbenos por WhatsApp." };
  return { ok: true };
}
