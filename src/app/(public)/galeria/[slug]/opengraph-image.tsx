import { getAlbumWithPhotos } from "@/lib/data/public";
import { OG_SIZE, OG_PHOTO_TYPE, albumCard } from "@/lib/og/card";

export const alt = "Álbum de fotos de Young Business Leaders";
export const size = OG_SIZE;
export const contentType = OG_PHOTO_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getAlbumWithPhotos(slug);
  return albumCard(data?.album ?? null, data?.photos.length ?? 0);
}
