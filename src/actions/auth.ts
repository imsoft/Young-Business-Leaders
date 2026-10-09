"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema, fieldErrors, type FieldErrors } from "@/lib/validation";
import { SITE_URL } from "@/lib/constants";

export type AuthState = { errors?: FieldErrors; message?: string } | undefined;

function safeNext(next: FormDataEntryValue | null) {
  const value = typeof next === "string" ? next : "";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/comunidad";
}

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return host ? `${proto}://${host}` : SITE_URL;
}

export async function signInWithPassword(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { message: "Correo o contraseña incorrectos." };
  redirect(safeNext(formData.get("next")));
}

export async function signUpWithPassword(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
      emailRedirectTo: `${await origin()}/auth/callback?next=/comunidad/perfil`,
    },
  });
  if (error) {
    return {
      message:
        error.code === "user_already_exists"
          ? "Ese correo ya tiene cuenta. Inicia sesión."
          : "No pudimos crear tu cuenta. Intenta de nuevo.",
    };
  }
  // Con confirmación de correo activada no hay sesión todavía.
  if (!data.session) redirect("/registro?check=1");
  redirect("/comunidad/perfil?welcome=1");
}

export async function signInWithGoogle(formData: FormData) {
  const supabase = await createClient();
  const next = safeNext(formData.get("next"));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${await origin()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error || !data.url) redirect("/login?error=google");
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
