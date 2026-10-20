import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Globe } from "lucide-react";
import { requireMember } from "@/lib/auth";
import { getVentureWithOwner, getVentures } from "@/lib/data/ventures";
import { VentureCard, VentureContact, VentureLogo, roleLabel, stageLabel } from "@/components/community/venture-card";
import { DeveloperBadge } from "@/components/community/developer-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Emprendimiento" };

export default function EmprendimientoPage({ params }: PageProps<"/comunidad/emprendimientos/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-3xl rounded-3xl" />}>
      <Body params={params} />
    </Suspense>
  );
}

async function Body({ params }: { params: PageProps<"/comunidad/emprendimientos/[id]">["params"] }) {
  const { id } = await params;
  await requireMember(`/comunidad/emprendimientos/${id}`);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const v = await getVentureWithOwner(id);
  if (!v) notFound();
  const others = v.owner ? (await getVentures([v.owner.id])).filter((x) => x.id !== v.id) : [];
  const role = roleLabel(v.role);
  const stage = stageLabel(v.stage);
  const site = v.website?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <Link href="/comunidad/emprendimientos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Emprendimientos
      </Link>

      <article className="rounded-3xl border bg-card p-6 shadow-sm md:p-10">
        <header className="flex flex-col items-start gap-6 sm:flex-row">
          <VentureLogo venture={v} className="size-24 rounded-2xl text-4xl" />
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-3xl font-extrabold text-balance">{v.name}</h1>
            {v.tagline ? <p className="mt-1 text-lg text-muted-foreground">{v.tagline}</p> : null}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {stage ? <Badge variant="outline">{stage}</Badge> : null}
              {v.industry ? <Badge variant="secondary">{v.industry}</Badge> : null}
            </div>
            {v.website ? (
              <a href={v.website} target="_blank" rel="noreferrer" className={cn(buttonVariants(), "mt-5 font-semibold")}>
                <Globe /> {site}
              </a>
            ) : null}
          </div>
        </header>

        {v.description ? (
          <section aria-labelledby="sobre" className="mt-10">
            <h2 id="sobre" className="font-heading mb-3 text-lg font-extrabold">Sobre {v.name}</h2>
            <p className="whitespace-pre-line text-foreground/90">{v.description}</p>
          </section>
        ) : null}

        <section aria-labelledby="contacto" className="mt-10">
          <h2 id="contacto" className="font-heading mb-3 text-lg font-extrabold">Contacto</h2>
          {v.contact_phone || v.contact_email || v.instagram || v.tiktok || v.facebook || v.linkedin ? (
            <VentureContact venture={v} large />
          ) : (
            <p className="text-sm text-muted-foreground">
              No agregó datos de contacto. Escríbele a {v.owner ? <Link href={`/comunidad/${v.owner.id}`} className="underline">{v.owner.full_name}</Link> : "su fundador"} desde su perfil.
            </p>
          )}
        </section>

        {v.owner ? (
          <section aria-labelledby="equipo" className="mt-10">
            <h2 id="equipo" className="font-heading mb-3 text-lg font-extrabold">Quién está detrás</h2>
            <Link href={`/comunidad/${v.owner.id}`} className="flex items-center gap-4 rounded-2xl border p-4 transition hover:border-gold/50 hover:bg-accent/40">
              <Avatar className="size-14">
                <AvatarImage src={v.owner.avatar_url ?? undefined} alt="" />
                <AvatarFallback>{initials(v.owner.full_name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading font-bold">{v.owner.full_name}</span>
                  <DeveloperBadge profileId={v.owner.id} compact />
                </div>
                {role ? <p className="text-sm font-medium text-gold-deep">{role}</p> : null}
                {v.owner.headline ? <p className="truncate text-sm text-muted-foreground">{v.owner.headline}</p> : null}
              </div>
            </Link>
          </section>
        ) : null}
      </article>

      {others.length > 0 && v.owner ? (
        <section aria-labelledby="otros">
          <h2 id="otros" className="font-heading mb-3 text-lg font-extrabold">Otros emprendimientos de {v.owner.full_name.split(" ")[0]}</h2>
          <div className="grid gap-3">
            {others.map((o) => <VentureCard key={o.id} venture={o} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
