import manifest from "@/lib/data/site-media.json";

export type MediaImage = { src: string; width: number; height: number; blur: string };
export type PosterType = "conferencia" | "taller" | "networking" | "visita";
export type Poster = MediaImage & { type: PosterType; number: number | null; title: string; slug: string };

/** Imágenes de diseño del sitio (public/media/site). Las genera scripts/photos-import.mjs. */
export const siteMedia = manifest.site as Record<string, MediaImage>;

/** Carteles de eventos pasados, del más reciente al más antiguo. */
export const posters = manifest.posters as Poster[];

export const marqueePhotos = Object.keys(siteMedia)
  .filter((k) => k.startsWith("marquee-"))
  .sort()
  .map((k) => siteMedia[k]);

export const POSTER_TYPES: { type: PosterType; label: string; plural: string }[] = [
  { type: "conferencia", label: "Conferencia", plural: "Conferencias" },
  { type: "taller", label: "Taller", plural: "Talleres" },
  { type: "networking", label: "Networking", plural: "Networking" },
  { type: "visita", label: "Visita a empresa", plural: "Visitas a empresas" },
];

export function posterLabel(p: Pick<Poster, "type" | "number">) {
  const label = POSTER_TYPES.find((t) => t.type === p.type)?.label ?? "";
  return p.number ? `${label} #${p.number}` : label;
}

/** Eventos distintos por tipo (una conferencia con dos carteles cuenta una vez). */
export function trajectoryStats(list: Poster[] = posters) {
  return POSTER_TYPES.map(({ type, plural }) => {
    const ofType = list.filter((p) => p.type === type);
    const numbered = new Set(ofType.filter((p) => p.number !== null).map((p) => p.number));
    return { type, label: plural, count: numbered.size + ofType.filter((p) => p.number === null).length };
  });
}

/**
 * Las fotos que sube el sitio llevan sus dimensiones en el nombre (…-1600x1067.webp).
 * Con eso la galería reserva el espacio exacto sin guardar columnas extra.
 */
export function dimsFromUrl(url: string): { width: number; height: number } | null {
  const m = /-(\d{2,5})x(\d{2,5})\.[a-z0-9]+(?:\?.*)?$/i.exec(url);
  if (!m) return null;
  const width = Number(m[1]);
  const height = Number(m[2]);
  return width > 0 && height > 0 ? { width, height } : null;
}
