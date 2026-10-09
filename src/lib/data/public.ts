import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { Event, GalleryAlbum, GalleryPhoto, Sponsor } from "@/lib/types";

export const TAGS = {
  events: "events",
  gallery: "gallery",
  sponsors: "sponsors",
} as const;

export async function getUpcomingEvents(limit = 20): Promise<Event[]> {
  "use cache";
  cacheTag(TAGS.events);
  cacheLife("hours");
  if (!hasSupabaseEnv()) return [];
  const { data } = await createPublicClient()
    .from("events")
    .select("*")
    .eq("published", true)
    .gte("starts_at", new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString())
    .order("starts_at", { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function getPastEvents(limit = 12): Promise<Event[]> {
  "use cache";
  cacheTag(TAGS.events);
  cacheLife("hours");
  if (!hasSupabaseEnv()) return [];
  const { data } = await createPublicClient()
    .from("events")
    .select("*")
    .eq("published", true)
    .lt("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  "use cache";
  cacheTag(TAGS.events, `event:${slug}`);
  cacheLife("hours");
  if (!hasSupabaseEnv()) return null;
  const { data } = await createPublicClient()
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data ?? null;
}

export async function getAlbums(): Promise<GalleryAlbum[]> {
  "use cache";
  cacheTag(TAGS.gallery);
  cacheLife("hours");
  if (!hasSupabaseEnv()) return [];
  const { data } = await createPublicClient()
    .from("gallery_albums")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("event_date", { ascending: false });
  return data ?? [];
}

export async function getAlbumWithPhotos(
  slug: string,
): Promise<{ album: GalleryAlbum; photos: GalleryPhoto[] } | null> {
  "use cache";
  cacheTag(TAGS.gallery, `album:${slug}`);
  cacheLife("hours");
  if (!hasSupabaseEnv()) return null;
  const supabase = createPublicClient();
  const { data: album } = await supabase
    .from("gallery_albums")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (!album) return null;
  const { data: photos } = await supabase
    .from("gallery_photos")
    .select("*")
    .eq("album_id", album.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return { album, photos: photos ?? [] };
}

export async function getSponsors(): Promise<Sponsor[]> {
  "use cache";
  cacheTag(TAGS.sponsors);
  cacheLife("days");
  if (!hasSupabaseEnv()) return [];
  const { data } = await createPublicClient()
    .from("sponsors")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}
