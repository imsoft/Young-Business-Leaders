import { CONTACT_EMAIL, INSTAGRAM_URL, SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Event } from "@/lib/types";

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organizacion`,
    name: SITE_NAME,
    alternateName: "YBL",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/brand/ybl-logo-512.png"),
    email: CONTACT_EMAIL,
    description: "Comunidad de jóvenes emprendedores en Jalisco: conferencias, talleres, networking y visitas a empresas.",
    areaServed: { "@type": "State", name: "Jalisco, México" },
    sameAs: [INSTAGRAM_URL],
  };
}

/** Evento para Google (resultados enriquecidos con fecha y lugar). */
export function eventJsonLd(event: Event) {
  const url = absoluteUrl(`/eventos/${event.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description ?? event.summary ?? undefined,
    startDate: event.starts_at,
    endDate: event.ends_at ?? undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location ?? "Guadalajara, Jalisco",
      address: event.address ?? event.location ?? "Guadalajara, Jalisco, México",
    },
    image: [event.cover_url ?? absoluteUrl("/opengraph-image")],
    url,
    organizer: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    isAccessibleForFree: true,
    ...(event.is_public
      ? { offers: { "@type": "Offer", price: 0, priceCurrency: "MXN", availability: "https://schema.org/InStock", url } }
      : {}),
  };
}
