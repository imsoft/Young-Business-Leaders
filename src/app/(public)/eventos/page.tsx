import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/site/section";
import { EventCard } from "@/components/site/event-card";
import { getPastEvents, getUpcomingEvents } from "@/lib/data/public";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { TrajectoryArchive, TrajectoryStats } from "@/components/site/trajectory";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Conferencias, talleres y reuniones de Young Business Leaders MX.",
};

export default async function EventosPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  return (
    <>
      <div className="bg-cream">
        <Section className="py-14 md:py-16">
          <SectionHeading
            eyebrow="Agenda"
            title="Eventos"
            description="Conferencias, talleres y reuniones. Los eventos abiertos aceptan registro sin cuenta; los de miembros requieren aprobación."
          />
          {upcoming.length === 0 ? (
            <p className="rounded-2xl border border-dashed bg-card p-10 text-center text-muted-foreground">
              No hay eventos próximos por ahora. Vuelve pronto.
            </p>
          ) : (
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => (
                <StaggerItem key={e.id}><EventCard event={e} className="h-full" /></StaggerItem>
              ))}
            </Stagger>
          )}
        </Section>
      </div>
      {past.length > 0 ? (
        <Section>
          <SectionHeading eyebrow="Historial" title="Eventos pasados" />
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => (
              <StaggerItem key={e.id}><EventCard event={e} className="h-full opacity-90" /></StaggerItem>
            ))}
          </Stagger>
        </Section>
      ) : null}
      <Section id="trayectoria" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Trayectoria"
          title="Todo lo que hemos hecho"
          description="Conferencias, talleres, networking y visitas a empresas desde que empezó la comunidad. Toca cualquier cartel para verlo en grande."
        />
        <div className="mb-14">
          <TrajectoryStats />
        </div>
        <TrajectoryArchive />
      </Section>
    </>
  );
}
