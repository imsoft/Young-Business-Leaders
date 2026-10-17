/**
 * Limpia el texto de búsqueda antes de meterlo en un filtro `or()` de PostgREST:
 * quita los caracteres con significado en la sintaxis del filtro y en ILIKE.
 */
export function sanitizeSearch(input: unknown, max = 60): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[,()*%_\\:."']/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}
