import { getEventBySlug } from "@/lib/data/public";
import { OG_SIZE, OG_PHOTO_TYPE, eventCard } from "@/lib/og/card";

export const alt = "Evento de Young Business Leaders";
export const size = OG_SIZE;
export const contentType = OG_PHOTO_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return eventCard(await getEventBySlug(slug));
}
