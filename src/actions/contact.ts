"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { contactSchema, fieldErrors, type FieldErrors } from "@/lib/validation";

export type ContactState = { errors?: FieldErrors; message?: string; ok?: boolean } | undefined;

export async function sendContact(_: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const { name, email, message } = parsed.data;
  const { error } = await createAdminClient().from("contact_messages").insert({ name, email, message });
  if (error) return { message: "No se pudo enviar. Escríbenos por WhatsApp." };
  return { ok: true };
}
