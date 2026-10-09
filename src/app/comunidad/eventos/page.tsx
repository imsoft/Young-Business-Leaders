import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireMember } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/site/event-card";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/types";

export const metadata: Metadata = { title: "Mis eventos" };

export default function MisEventosPage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold">Mis eventos</h1>
          <p className="text-muted-foreground">Eventos a los que te has registrado.</p>
        </div>
        <Link href="/eventos" className={cn(buttonVariants({ variant: "outline" }))}>Ver todos los eventos</Link>
      </div>
      <Suspense fallback={<Skeleton className="h-64 rounded-2xl" />}>
        <Body />
      </Suspense>
    </div>
  );
}

async function Body() {
  const profile = await requireMember("/comunidad/eventos");
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_registrations")
    .select("events(*)")
    .eq("user_id", profile.id);
  const events = ((data ?? []) as unknown as { events: Event | null }[])
    .map((r) => r.events)
    .filter((e): e is Event => Boolean(e))
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  if (events.length === 0) {
    return <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">Aún no te has registrado a ningún evento.</p>;
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => (
        <EventCard key={e.id} event={e} />
      ))}
    </div>
  );
}
