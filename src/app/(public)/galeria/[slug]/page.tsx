import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Lightbox, LightboxTrigger } from "@/components/media/lightbox";
import { dimsFromUrl } from "@/lib/media";
import { Section, SectionHeading } from "@/components/site/section";
import { getAlbumWithPhotos } from "@/lib/data/public";
import { formatShortDate } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/galeria/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAlbumWithPhotos(slug);
  return { title: data?.album.title ?? "Álbum" };
}

export default function AlbumPage({ params }: PageProps<"/galeria/[slug]">) {
  return (
    <Suspense fallback={<Skeleton className="mx-auto my-10 h-96 max-w-6xl rounded-3xl" />}>
      <AlbumBody params={params} />
    </Suspense>
  );
}

async function AlbumBody({ params }: { params: PageProps<"/galeria/[slug]">["params"] }) {
  const { slug } = await params;
  const data = await getAlbumWithPhotos(slug);
  if (!data) notFound();
  const { album, photos } = data;
  const items = photos.map((p, i) => {
    const dims = dimsFromUrl(p.url) ?? { width: 1200, height: 900 };
    return { id: p.id, src: p.url, ...dims, alt: p.caption ?? `${album.title}, foto ${i + 1}`, caption: p.caption ?? album.title, text: p.caption };
  });
  return (
    <Section>
      <Link href="/galeria" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Galería
      </Link>
      <SectionHeading
        eyebrow={album.event_date ? formatShortDate(album.event_date) : undefined}
        title={album.title}
        description={album.description ?? undefined}
      />
      {photos.length === 0 ? (
        <p className="text-muted-foreground">Este álbum aún no tiene fotos.</p>
      ) : (
        <Lightbox items={items}>
          <Stagger className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3">
            {items.map((p, i) => (
              <StaggerItem key={p.id} className="break-inside-avoid">
                <figure className="group overflow-hidden rounded-xl bg-muted">
                  <LightboxTrigger index={i} label={p.alt}>
                    <Image
                      src={p.src}
                      alt={p.alt}
                      width={p.width}
                      height={p.height}
                      sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                      className="h-auto w-full transition duration-500 group-hover:scale-[1.03]"
                    />
                  </LightboxTrigger>
                  {p.text ? <figcaption className="px-2 py-1 text-xs text-muted-foreground">{p.text}</figcaption> : null}
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </Lightbox>
      )}
    </Section>
  );
}
