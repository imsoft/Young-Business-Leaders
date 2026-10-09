import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAlbums, getPastEvents, getUpcomingEvents } from "@/lib/data/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [upcoming, past, albums] = await Promise.all([getUpcomingEvents(100), getPastEvents(100), getAlbums()]);
  const statics = ["", "/nosotros", "/eventos", "/galeria", "/contacto", "/registro"].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  return [
    ...statics,
    ...[...upcoming, ...past].map((e) => ({ url: `${SITE_URL}/eventos/${e.slug}`, lastModified: e.updated_at, priority: 0.8 })),
    ...albums.map((a) => ({ url: `${SITE_URL}/galeria/${a.slug}`, priority: 0.5 })),
  ];
}
