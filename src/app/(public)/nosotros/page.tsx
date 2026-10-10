import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import Image from "next/image";
import { siteMedia, type MediaImage } from "@/lib/media";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Qué es Young Business Leaders MX y por qué existe.",
};

const VALUES = [
  ["Comunidad", "Nadie emprende solo. Aquí encuentras con quién."],
  ["Acción", "Menos teoría, más proyectos reales avanzando."],
  ["Jalisco", "Jóvenes que conectan un Jalisco más grande."],
  ["Crecimiento", "Personal y profesional, en ese orden."],
];

export default function NosotrosPage() {
  return (
    <>
      <div className="bg-cream">
        <Section className="py-16 md:py-20">
          <SectionHeading
            eyebrow="Nosotros"
            title="Jóvenes que conectan un Jalisco más grande"
            description="Young Business Leaders (YBL) es una comunidad de jóvenes emprendedores en Jalisco. Organizamos conferencias, talleres y reuniones para que quienes están construyendo un negocio tengan con quién aprender, a quién preguntarle y con quién hacer equipo."
          />
        </Section>
      </div>
      <Collage />
      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <Reveal className="space-y-4 text-muted-foreground">
            <h2 className="font-heading text-2xl font-extrabold text-foreground">Lo que hacemos</h2>
            <p>
              Cada año organizamos conferencias con empresarios y líderes de la región, talleres prácticos sobre
              finanzas, ventas y operación, y reuniones mensuales exclusivas para miembros donde se presentan proyectos y
              se abren puertas.
            </p>
            <p>
              También impulsamos eventos de ciudad, como <strong className="text-foreground">Jalisco al Grito</strong>, para
              celebrar lo nuestro y reunir a la comunidad emprendedora fuera de la sala de juntas.
            </p>
          </Reveal>
          <Stagger as="ul" className="grid gap-4 sm:grid-cols-2">
            {VALUES.map(([t, d]) => (
              <StaggerItem as="li" key={t} className="rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                <h3 className="font-heading font-bold text-gold-deep">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <Reveal className="mt-14 rounded-3xl bg-gold-gradient p-8 text-ink md:p-12">
          <h2 className="font-heading text-2xl font-extrabold md:text-3xl">¿Tienes un proyecto o una idea?</h2>
          <p className="mt-2 max-w-xl text-ink/80">
            Regístrate, cuéntanos en qué estás y el equipo de YBL revisará tu solicitud para darte acceso a la
            comunidad.
          </p>
          <Link href="/registro" className={cn(buttonVariants({ size: "lg" }), "mt-6 bg-ink text-white hover:bg-ink/85")}>
            Unirme a YBL <ArrowRight />
          </Link>
        </Reveal>
      </Section>
    </>
  );
}

function Photo({ image, alt, className, sizes }: { image: MediaImage | undefined; alt: string; className?: string; sizes: string }) {
  if (!image) return null;
  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-muted shadow-sm", className)}>
      <Image src={image.src} alt={alt} fill sizes={sizes} placeholder="blur" blurDataURL={image.blur} className="object-cover" />
    </div>
  );
}

function Collage() {
  if (!siteMedia["nosotros-1"]) return null;
  return (
    <div className="mx-auto -mt-8 max-w-6xl px-4 md:-mt-10">
      <Reveal className="grid grid-cols-2 gap-3 md:grid-cols-[1.5fr_0.8fr_1.2fr] md:gap-4">
        <Photo image={siteMedia["nosotros-1"]} alt="Toma de protesta de Young Business Leaders" sizes="(min-width:768px) 45vw, 100vw" className="col-span-2 aspect-[16/10] md:col-span-1 md:aspect-auto md:h-[22rem]" />
        <Photo image={siteMedia["nosotros-2"]} alt="Reconocimiento con el logotipo de Young Business Leaders" sizes="(min-width:768px) 22vw, 50vw" className="aspect-[4/5] md:aspect-auto md:h-[22rem]" />
        <Photo image={siteMedia["nosotros-3"]} alt="Asistentes y ponentes al cierre de una conferencia" sizes="(min-width:768px) 33vw, 50vw" className="aspect-[4/5] md:aspect-auto md:h-[22rem]" />
      </Reveal>
    </div>
  );
}
