import "server-only";
import { headers } from "next/headers";

/**
 * Verifica el token de Cloudflare Turnstile. Si no hay llave secreta configurada
 * (desarrollo local), deja pasar para no bloquear el sitio.
 */
export async function verifyTurnstile(token: FormDataEntryValue | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token) return false;
  const h = await headers();
  const ip = h.get("cf-connecting-ip") ?? h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim();
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export const TURNSTILE_FAILED = "No pudimos verificar que no eres un robot. Recarga la página e intenta de nuevo.";
