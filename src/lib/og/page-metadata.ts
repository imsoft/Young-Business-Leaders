import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

/**
 * Open Graph completo para una página. Hace falta porque un objeto openGraph en una página
 * reemplaza por completo el del layout (siteName, locale…). La imagen sale del opengraph-image del segmento.
 */
export function openGraphFor({ path, title, description }: { path: string; title: string; description?: string }): Metadata["openGraph"] {
  return { type: "website", locale: "es_MX", siteName: SITE_NAME, url: path, title, description };
}
