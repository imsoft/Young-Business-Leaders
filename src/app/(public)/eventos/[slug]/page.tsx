import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { getEventBySlug } from "@/lib/data/public";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { formatEventDate, formatEventTime, initials } from "@/lib/format";
import { EventRegistration } from "@/components/site/event-registration";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@/lib/types";

export async function generateMetadata({ params }: PageProps<"/eventos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Evento" };
  return {
    title: event.title,
    description: event.summary ?? undefined,
    openGraph: event.cover_url ? { images: [event.cover_url] } : undefined,
  };
}

export default function EventoPage({ params }: PageProps<"/eventos/[slug]">) {
  return (
    <Suspense fallback={<Skeleton className="mx-auto my-10 h-96 max-w-6xl rounded-3xl" />}>
      <EventBody params={params} />
    </Suspense>
  );
}

async function EventBody({ params }: { params: PageProps<"/eventos/[slug]">["params"] }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  return (
    <article>
      <div className="relative bg-gold-gradient">
        {event.cover_url ? (
          <Image src={event.cover_url} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
        ) : null}
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-ink md:py-24">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge className="bg-white text-ink">{formatEventDate(event.starts_at)}</Badge>
            {!event.is_public ? <Badge className="bg-ink text-white">Solo miembros</Badge> : null}
          </div>
          <h1 className="font-heading max-w-3xl text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
            {event.title}
          </h1>
          {event.summary ? <p className="mt-4 max-w-2xl text-lg text-ink/80">{event.summary}</p> : null}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1fr_360px] md:py-16">
        <div className="space-y-8">
          <dl className="grid gap-4 sm:grid-cols-2">
            <Info icon={CalendarDays} label="Fecha" value={formatEventDate(event.starts_at)} />
            <Info
              icon={Clock}
              label="Hora"
              value={`${formatEventTime(event.starts_at)}${event.ends_at ? ` – ${formatEventTime(event.ends_at)}` : ""}`}
            />
            {event.location ? <Info icon={MapPin} label="Lugar" value={event.location} sub={event.address ?? undefined} /> : null}
            <Suspense fallback={<Info icon={Users} label="Asistentes" value="…" />}>
              <AttendeeCount event={event} />
            </Suspense>
          </dl>
          {event.description ? (
            <div className="prose prose-neutral max-w-none whitespace-pre-line text-foreground/90">{event.description}</div>
          ) : null}
          <Suspense fallback={null}>
            <WhoIsGoing event={event} />
          </Suspense>
        </div>
        <aside className="md:sticky md:top-24 md:self-start">
          <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
            <RegistrationPanel event={event} />
          </Suspense>
        </aside>
      </div>
    </article>
  );
}

function Info({ icon: Icon, label, value, sub }: { icon: typeof CalendarDays; label: string; value: string; sub?: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border bg-card p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-gold-deep">
        <Icon className="size-5" />
      </span>
      <div>
        <dt className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{label}</dt>
        <dd className="font-medium capitalize">{value}</dd>
        {sub ? <dd className="text-sm text-muted-foreground">{sub}</dd> : null}
      </div>
    </div>
  );
}

async function AttendeeCount({ event }: { event: Event }) {
  if (!hasSupabaseEnv()) return null;
  const { data: count } = await createPublicClient().rpc("event_attendee_count", { event: event.id });
  const n = count ?? 0;
  const value = event.capacity ? `${n} / ${event.capacity}` : `${n} registrados`;
  return <Info icon={Users} label="Asistentes" value={value} />;
}

/** Lee sesión + registro propio. Siempre dentro de Suspense. */
async function RegistrationPanel({ event }: { event: Event }) {
  const profile = await getCurrentProfile();
  let registered = false;
  let full = false;
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    if (profile) {
      const { data } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", event.id)
        .eq("user_id", profile.id)
        .maybeSingle();
      registered = Boolean(data);
    }
    if (event.capacity) {
      const { data: count } = await supabase.rpc("event_attendee_count", { event: event.id });
      full = (count ?? 0) >= event.capacity;
    }
  }
  const viewer = !profile ? "anonymous" : profile.status === "approved" || profile.is_admin ? "member" : "pending";
  return (
    <EventRegistration
      eventId={event.id}
      slug={event.slug}
      isPublic={event.is_public}
      full={full}
      viewer={viewer}
      registered={registered}
    />
  );
}

/** Solo miembros aprobados ven quién va (RLS lo garantiza). */
async function WhoIsGoing({ event }: { event: Event }) {
  const profile = await getCurrentProfile();
  if (!profile || (profile.status !== "approved" && !profile.is_admin)) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_registrations")
    .select("user_id, profiles:profiles!event_registrations_user_id_fkey(id, full_name, avatar_url, company)")
    .eq("event_id", event.id)
    .not("user_id", "is", null)
    .limit(60);
  type Row = { user_id: string | null; profiles: { id: string; full_name: string; avatar_url: string | null; company: string | null } | null };
  const people = ((data ?? []) as unknown as Row[]).map((r) => r.profiles).filter((p): p is NonNullable<Row["profiles"]> => Boolean(p));
  if (people.length === 0) return null;
  return (
    <section>
      <h2 className="font-heading mb-4 text-xl font-bold">Miembros que van</h2>
      <ul className="flex flex-wrap gap-3">
        {people.map((p) => (
          <li key={p.id} className="flex items-center gap-2 rounded-full border bg-card py-1 pr-3 pl-1 text-sm">
            <Avatar size="sm">
              <AvatarImage src={p.avatar_url ?? undefined} alt="" />
              <AvatarFallback>{initials(p.full_name)}</AvatarFallback>
            </Avatar>
            {p.full_name}
          </li>
        ))}
      </ul>
    </section>
  );
}
