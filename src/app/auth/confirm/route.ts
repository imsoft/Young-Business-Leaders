import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/safe-redirect";

const TYPES: EmailOtpType[] = ["email", "signup", "invite", "magiclink", "recovery", "email_change"];

/**
 * Destino de los enlaces de los correos de Supabase (token_hash).
 * A diferencia del intercambio de código PKCE, funciona aunque el correo se abra en otro dispositivo.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  // La recuperación siempre lleva a elegir contraseña, sin importar qué `next` traiga el correo.
  const next = type === "recovery" ? "/actualizar-contrasena" : safeNextPath(searchParams.get("next"));

  if (tokenHash && type && TYPES.includes(type)) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/login?error=enlace`);
}
