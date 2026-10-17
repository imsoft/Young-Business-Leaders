/**
 * Devuelve una ruta interna segura para redirigir después de login/OAuth.
 * Rechaza URLs absolutas, protocol-relative (`//x`) y trucos con backslash (`/\x`),
 * que los navegadores interpretan como otro dominio.
 */
export function safeNextPath(value: unknown, fallback = "/comunidad"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.includes("\\")) return fallback;
  try {
    const base = "https://ybl.invalid";
    const url = new URL(value, base);
    if (url.origin !== base) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
