import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

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
