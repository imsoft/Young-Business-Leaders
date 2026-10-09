const TZ = "America/Mexico_City";
const LOCALE = "es-MX";

export function formatEventDate(iso: string) {
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: TZ,
  }).format(new Date(iso));
}

export function formatEventTime(iso: string) {
  return new Intl.DateTimeFormat(LOCALE, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TZ,
  }).format(new Date(iso));
}

export function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(iso));
}

/** Partes para el "chip" de fecha en tarjetas: { day: "11", month: "sep" } */
export function dateChip(iso: string) {
  const d = new Date(iso);
  const day = new Intl.DateTimeFormat(LOCALE, { day: "2-digit", timeZone: TZ }).format(d);
  const month = new Intl.DateTimeFormat(LOCALE, { month: "short", timeZone: TZ })
    .format(d)
    .replace(".", "");
  return { day, month };
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Convierte un valor de <input type="datetime-local"> (hora de Ciudad de México) a ISO con offset -06:00. */
export function localDateTimeToIso(value: string) {
  if (!value) return null;
  const withSeconds = value.length === 16 ? `${value}:00` : value;
  return `${withSeconds}-06:00`;
}

/** Convierte ISO a valor de datetime-local en hora de MX (YYYY-MM-DDTHH:mm). */
export function isoToLocalDateTime(iso: string | null) {
  if (!iso) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}-${get("month")}-${get("day")}T${hour}:${get("minute")}`;
}
