import Link from "next/link";
import { ArrowRight, Lightbulb, Rocket, Sparkles, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/section";
import { EventCard } from "@/components/site/event-card";
import { SponsorsStrip } from "@/components/site/sponsors-strip";
import { getUpcomingEvents, getAlbums } from "@/lib/data/public";
import { INSTAGRAM_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { FloatingMark, HeroGlow, HeroIntro, HeroLine } from "@/components/motion/hero";

const PILLARS = [
  {
    icon: Rocket,
    title: "Conviértete en emprendedor",
    text: "Acompañamiento para pasar de la idea al negocio, con gente que ya recorrió el camino.",
  },
  {
    icon: Lightbulb,
    title: "Inspírate con eventos y talleres",
    text: "Conferencias, talleres prácticos y reuniones mensuales con empresarios y expertos.",
  },
  {
    icon: Sparkles,
    title: "Crecimiento personal y profesional",
    text: "Habilidades, red de contactos y una comunidad que te empuja a dar el siguiente paso.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <Section id="pilares">
        <SectionHeading
          eyebrow="Qué hacemos"
          title="Una comunidad para jóvenes que quieren emprender en serio"
          description="Young Business Leaders reúne a jóvenes de Jalisco con ganas de construir. Aprendemos, conectamos y crecemos juntos."
        />
        <Stagger className="grid gap-5 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title} className="group rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <span className="mb-4 grid size-11 place-items-center rounded-xl bg-accent text-gold-deep transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <Icon className="size-5" />
              </span>
              <h3 className="font-heading text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <div className="bg-cream">
        <Section>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Agenda" title="Próximos eventos" />
            <Link href="/eventos" className={cn(buttonVariants({ variant: "outline" }), "mb-10")}>
              Ver todos <ArrowRight />
            </Link>
          </div>
          <UpcomingEvents />
        </Section>
      </div>

      <AlbumsPreview />

      <div className="bg-ink text-white">
        <Section className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-gold uppercase">Comunidad</p>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
              Conoce a los miembros y haz equipo
            </h2>
            <p className="mt-4 text-white/70">
              Al unirte tienes acceso al directorio de miembros, puedes registrarte a reuniones exclusivas y conectar
              con otros emprendedores de tu industria.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/registro" className={cn(buttonVariants({ size: "lg" }), "font-semibold")}>
                Quiero unirme <Users />
              </Link>
              <Link href="/comunidad" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white")}>
                Ver directorio
              </Link>
            </div>
          </Reveal>
          <Stagger as="ul" className="grid gap-3 text-sm">
            {[
              "Perfil con tu proyecto, industria y redes",
              "Directorio filtrable por industria y ciudad",
              "Registro a eventos y reuniones de miembros",
              "Entrada aprobada por el equipo de YBL",
            ].map((t) => (
              <StaggerItem as="li" key={t} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-gold/40 hover:bg-white/10">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold text-[11px] font-bold text-ink">✓</span>
                {t}
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      </div>

      <Section className="py-12 md:py-16">
        <Reveal>
          <SponsorsStrip title="Aliados y patrocinadores" />
        </Reveal>
      </Section>
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gold-gradient">
      <HeroGlow />
      <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[1.2fr_1fr] md:items-center md:py-28">
        <HeroIntro className="text-ink">
          <HeroLine>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-bold tracking-wider uppercase">
              🚀 Jóvenes emprendedores · Jalisco
            </p>
          </HeroLine>
          <HeroLine>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-balance sm:text-5xl md:text-6xl">
              Emprendiendo hacia el éxito empresarial
            </h1>
          </HeroLine>
          <HeroLine>
            <p className="mt-5 max-w-xl text-lg text-ink/80">
              Eventos, talleres y una red de jóvenes que ya están construyendo sus negocios. Si tienes una idea o un
              proyecto, este es tu lugar.
            </p>
          </HeroLine>
          <HeroLine className="mt-8 flex flex-wrap gap-3">
            <Link href="/registro" className={cn(buttonVariants({ size: "lg" }), "bg-ink text-white hover:bg-ink/85 font-semibold")}>
              Únete a la comunidad <ArrowRight />
            </Link>
            <Link href="/eventos" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-ink/20 bg-white/80 hover:bg-white")}>
              Próximos eventos
            </Link>
          </HeroLine>
          <HeroLine>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="mt-6 inline-block text-sm font-medium text-ink/70 underline-offset-4 hover:underline">
              Síguenos en Instagram @ybl.mx
            </a>
          </HeroLine>
        </HeroIntro>
        <FloatingMark className="relative mx-auto aspect-square w-64 md:w-80">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 rounded-full bg-white shadow-2xl" />
            <Image src="/brand/ybl-mark.svg" alt="Young Business Leaders" fill className="p-16" priority />
          </div>
        </FloatingMark>
      </div>
    </section>
  );
}

async function UpcomingEvents() {
  const events = await getUpcomingEvents(3);
  if (events.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
        Pronto anunciaremos nuevos eventos. Síguenos en Instagram para enterarte primero.
      </p>
    );
  }
  return (
    <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => (
        <StaggerItem key={e.id}>
          <EventCard event={e} className="h-full" />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

async function AlbumsPreview() {
  const albums = (await getAlbums()).slice(0, 4);
  if (albums.length === 0) return null;
  return (
    <Section>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Momentos" title="Lo que ha pasado en YBL" />
        <Link href="/galeria" className={cn(buttonVariants({ variant: "outline" }), "mb-10")}>
          Ver galería <ArrowRight />
        </Link>
      </div>
    <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {albums.map((a) => (
        <StaggerItem key={a.id}>
        <Link href={`/galeria/${a.slug}`} className="group relative block aspect-square overflow-hidden rounded-2xl bg-gold-gradient">
          {a.cover_url ? (
            <Image src={a.cover_url} alt="" fill sizes="25vw" className="object-cover transition duration-500 group-hover:scale-105" />
          ) : null}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <span className="font-heading font-bold text-white">{a.title}</span>
          </div>
        </Link>
        </StaggerItem>
      ))}
    </Stagger>
    </Section>
  );
}
