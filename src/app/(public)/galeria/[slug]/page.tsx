import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
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
        <Stagger className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3">
          {photos.map((p) => (
            <StaggerItem key={p.id} className="break-inside-avoid">
            <figure className="group overflow-hidden rounded-xl bg-muted">
              <Image src={p.url} alt={p.caption ?? ""} width={800} height={800} sizes="(min-width:1024px) 25vw, 50vw" className="h-auto w-full transition duration-500 group-hover:scale-[1.03]" />
              {p.caption ? <figcaption className="px-2 py-1 text-xs text-muted-foreground">{p.caption}</figcaption> : null}
            </figure>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </Section>
  );
}
