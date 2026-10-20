import { SITE_URL } from "@/lib/constants";
import { formatEventDate, formatEventTime } from "@/lib/format";
import type { Event } from "@/lib/types";
import { button, details, esc, layout, p } from "./layout.mjs";
import type { OutgoingEmail } from "./send";

const url = (path: string) => new URL(path, SITE_URL).toString();

/** Enlace "Agregar a Google Calendar" (fechas en UTC, formato YYYYMMDDTHHMMSSZ). */
export function googleCalendarUrl(event: Pick<Event, "title" | "starts_at" | "ends_at" | "location" | "address" | "summary" | "slug">) {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const end = event.ends_at ?? new Date(Date.parse(event.starts_at) + 2 * 60 * 60 * 1000).toISOString();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(event.starts_at)}/${fmt(end)}`,
    details: `${event.summary ? `${event.summary}\n\n` : ""}${url(`/eventos/${event.slug}`)}`,
    location: [event.location, event.address].filter(Boolean).join(", "),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function eventRegistrationEmail(event: Event, name: string | null, to: string): OutgoingEmail {
  const when = `${formatEventDate(event.starts_at)} · ${formatEventTime(event.starts_at)}${event.ends_at ? ` – ${formatEventTime(event.ends_at)}` : ""}`;
  const where = [event.location, event.address].filter(Boolean).join(" · ");
  const eventUrl = url(`/eventos/${event.slug}`);
  const hello = name ? `Hola ${esc(name)},` : "Hola,";
  const html = layout({
    siteUrl: SITE_URL,
    preheader: `Tu lugar en ${esc(event.title)} está confirmado.`,
    title: "¡Estás registrado!",
    body:
      p(hello) +
      p(`Tu registro a <strong>${esc(event.title)}</strong> quedó confirmado. Te esperamos.`) +
      details([["Cuándo", esc(when)], ...(where ? ([["Dónde", esc(where)]] as [string, string][]) : [])]) +
      button(googleCalendarUrl(event), "Agregar a mi calendario") +
      p(`<br>Detalles del evento: <a href="${eventUrl}" style="color:#D98C00">${eventUrl}</a>`),
    footnote: "Si ya no puedes asistir, avísanos respondiendo este correo para liberar tu lugar.",
  });
  const text = `${name ? `Hola ${name},` : "Hola,"}\n\nTu registro a ${event.title} quedó confirmado.\n\nCuándo: ${when}\n${where ? `Dónde: ${where}\n` : ""}\nDetalles: ${eventUrl}\n\nSi ya no puedes asistir, responde este correo.\n\nYoung Business Leaders · yblmx.org`;
  return { to, subject: `Registro confirmado: ${event.title}`, html, text };
}

export function memberApprovedEmail(name: string | null, to: string): OutgoingEmail {
  const hello = name ? `Hola ${esc(name)},` : "Hola,";
  const html = layout({
    siteUrl: SITE_URL,
    preheader: "Ya tienes acceso al directorio y a los eventos para miembros.",
    title: "¡Ya eres parte de YBL!",
    body:
      p(hello) +
      p("El equipo de <strong>Young Business Leaders</strong> aprobó tu solicitud. Desde hoy puedes ver el directorio de miembros, conectar con otros emprendedores y registrarte a los eventos exclusivos.") +
      button(url("/comunidad"), "Ir a la comunidad") +
      p("<br>Un buen primer paso: completa tu perfil para que los demás sepan en qué estás trabajando."),
    footnote: "Recibes este correo porque solicitaste unirte a la comunidad en yblmx.org.",
  });
  const text = `${name ? `Hola ${name},` : "Hola,"}\n\nEl equipo de Young Business Leaders aprobó tu solicitud. Ya puedes ver el directorio y registrarte a los eventos para miembros.\n\n${url("/comunidad")}\n\nYoung Business Leaders · yblmx.org`;
  return { to, subject: "¡Bienvenido a Young Business Leaders!", html, text };
}
