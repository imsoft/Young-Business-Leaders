import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Lightbox, LightboxTrigger } from "@/components/media/lightbox";
import { CountUp } from "@/components/motion/count-up";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { POSTER_TYPES, posterLabel, posters, trajectoryStats, type Poster } from "@/lib/media";
import { cn } from "@/lib/utils";

const toItem = (p: Poster) => ({ src: p.src, width: p.width, height: p.height, alt: `Cartel: ${p.title}`, caption: `${posterLabel(p)} · ${p.title}` });

/** Cartel sin recortar sobre su propia versión desenfocada, para que todos midan igual. */
function PosterCard({ poster, index, dark = false }: { poster: Poster; index: number; dark?: boolean }) {
  return (
    <LightboxTrigger index={index} label={poster.title} className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink shadow-sm ring-1 ring-black/5 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-125 bg-cover bg-center opacity-70 blur-xl"
          style={{ backgroundImage: `url(${poster.blur})` }}
        />
        <Image
          src={poster.src}
          alt={`Cartel: ${poster.title}`}
          fill
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 45vw"
          className="object-contain transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <p className="mt-3 text-[11px] font-bold tracking-[0.15em] text-gold-deep uppercase">{posterLabel(poster)}</p>
      <p className={cn("mt-0.5 line-clamp-2 text-sm leading-snug font-semibold", dark ? "text-white" : "text-foreground")}>{poster.title}</p>
    </LightboxTrigger>
  );
}

export function TrajectoryStats({ dark = false }: { dark?: boolean }) {
  const stats = trajectoryStats();
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.type} className={cn("border-l-2 border-gold pl-4", dark ? "text-white" : "text-foreground")}>
          <dd className="font-heading text-4xl font-extrabold tabular-nums md:text-5xl">
            <CountUp value={s.count} />
          </dd>
          <dt className={cn("mt-1 text-sm", dark ? "text-white/70" : "text-muted-foreground")}>{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}

/** Home: cifras + carrusel horizontal con los carteles más recientes. */
export function TrajectoryTeaser({ limit = 10 }: { limit?: number }) {
  const recent = posters.slice(0, limit);
  if (recent.length === 0) return null;
  return (
    <div className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-4 pt-16 md:pt-24">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-gold uppercase">Trayectoria</p>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
              Lo que hemos construido juntos
            </h2>
          </div>
          <Link href="/eventos#trayectoria" className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-sm font-medium transition hover:bg-white/10">
            Ver todo <ArrowRight className="size-4" />
          </Link>
        </Reveal>
        <Reveal>
          <TrajectoryStats dark />
        </Reveal>
      </div>
      <Lightbox items={recent.map(toItem)}>
        <Reveal className="mt-12 pb-16 md:pb-24">
          <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:gap-5 md:scroll-px-[max(1rem,calc((100vw-72rem)/2+1rem))] md:px-[max(1rem,calc((100vw-72rem)/2+1rem))]">
            {recent.map((p, i) => (
              <li key={p.slug} className="w-[62vw] max-w-[240px] shrink-0 snap-start sm:w-[220px]">
                <PosterCard poster={p} index={i} dark />
              </li>
            ))}
          </ul>
        </Reveal>
      </Lightbox>
    </div>
  );
}

/** Página de eventos: archivo completo agrupado por tipo. */
export function TrajectoryArchive() {
  if (posters.length === 0) return null;
  // Un solo visor para todo el archivo: el índice es la posición en esta lista ordenada.
  const ordered = POSTER_TYPES.flatMap(({ type }) =>
    posters.filter((p) => p.type === type).sort((a, b) => (b.number ?? 99) - (a.number ?? 99)),
  );
  const stats = trajectoryStats();
  return (
    <Lightbox items={ordered.map(toItem)}>
      <div className="space-y-14">
        {POSTER_TYPES.map(({ type, plural }) => {
          const group = ordered.filter((p) => p.type === type);
          if (group.length === 0) return null;
          return (
            <section key={type} aria-labelledby={`trayectoria-${type}`}>
              <h3 id={`trayectoria-${type}`} className="font-heading mb-5 flex items-baseline gap-3 text-xl font-bold">
                {plural}
                <span className="text-sm font-medium text-muted-foreground">{stats.find((s) => s.type === type)?.count}</span>
              </h3>
              <Stagger as="ul" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {group.map((p) => (
                  <StaggerItem as="li" key={p.slug}>
                    <PosterCard poster={p} index={ordered.indexOf(p)} />
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          );
        })}
      </div>
    </Lightbox>
  );
}
