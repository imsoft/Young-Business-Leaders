import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/site/section";
import { getAlbums } from "@/lib/data/public";
import { formatShortDate } from "@/lib/format";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { BrandPlaceholder } from "@/components/site/brand-placeholder";

export const metadata: Metadata = { title: "Galería", description: "Fotos de talleres, conferencias y reuniones de YBL." };

export default async function GaleriaPage() {
  const albums = await getAlbums();
  return (
    <Section>
      <SectionHeading eyebrow="Momentos" title="Galería" description="Talleres, conferencias y reuniones de la comunidad." />
      {albums.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">Pronto subiremos fotos.</p>
      ) : (
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((a) => (
            <StaggerItem key={a.id}>
            <Link href={`/galeria/${a.slug}`} className="group block h-full overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[4/3]">
                {a.cover_url ? (
                  <Image src={a.cover_url} alt="" fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <BrandPlaceholder className="transition duration-500 group-hover:scale-105" />
                )}
              </div>
              <div className="p-5">
                <h2 className="font-heading text-lg font-bold">{a.title}</h2>
                {a.event_date ? <p className="text-xs text-muted-foreground">{formatShortDate(a.event_date)}</p> : null}
                {a.description ? <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.description}</p> : null}
              </div>
            </Link>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </Section>
  );
}
