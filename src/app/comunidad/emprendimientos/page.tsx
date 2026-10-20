import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireMember } from "@/lib/auth";
import { listVentures } from "@/lib/data/ventures";
import { sanitizeSearch } from "@/lib/search";
import { INDUSTRIES, VENTURE_STAGES } from "@/lib/constants";
import { SearchFilters } from "@/components/community/search-filters";
import { VentureLogo, stageLabel } from "@/components/community/venture-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { initials } from "@/lib/format";

export const metadata: Metadata = { title: "Emprendimientos de la comunidad" };

export default function EmprendimientosPage({ searchParams }: PageProps<"/comunidad/emprendimientos">) {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold">Emprendimientos</h1>
        <p className="text-muted-foreground">Los proyectos de los miembros de YBL. Encuentra clientes, proveedores o socios.</p>
      </div>
      <Suspense>
        <SearchFilters
          basePath="/comunidad/emprendimientos"
          placeholder="Buscar por nombre o a qué se dedica"
          selects={[
            { key: "industria", label: "Todas las industrias", options: INDUSTRIES.map((i) => ({ value: i, label: i })) },
            { key: "etapa", label: "Todas las etapas", options: VENTURE_STAGES },
          ]}
        />
      </Suspense>
      <Suspense fallback={<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}</div>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({ searchParams }: { searchParams: PageProps<"/comunidad/emprendimientos">["searchParams"] }) {
  await requireMember("/comunidad/emprendimientos");
  const sp = await searchParams;
  const q = sanitizeSearch(sp.q);
  const industry = INDUSTRIES.find((i) => i === sp.industria);
  const stage = VENTURE_STAGES.find((s) => s.value === sp.etapa)?.value;
  const ventures = await listVentures({ q, industry, stage });

  if (ventures.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
        {q || industry || stage ? "No encontramos emprendimientos con esos filtros." : "Aún no hay emprendimientos registrados."}
        <p className="mt-2 text-sm">
          ¿Tienes uno? Agrégalo desde <Link href="/comunidad/perfil#mis-emprendimientos" className="font-medium text-foreground underline">Mi perfil</Link>.
        </p>
      </div>
    );
  }
  return (
    <>
      <p className="-mt-2 text-sm text-muted-foreground">{ventures.length === 1 ? "1 emprendimiento" : `${ventures.length} emprendimientos`}</p>
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ventures.map((v) => (
          <StaggerItem key={v.id}>
            <Link
              href={`/comunidad/emprendimientos/${v.id}`}
              className="flex h-full flex-col rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <VentureLogo venture={v} />
                <div className="min-w-0">
                  <h2 className="font-heading truncate font-bold">{v.name}</h2>
                  {v.industry ? <p className="truncate text-xs text-muted-foreground">{v.industry}</p> : null}
                </div>
              </div>
              {v.tagline ? <p className="mt-3 line-clamp-2 text-sm text-foreground/80">{v.tagline}</p> : null}
              <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                {v.owner ? (
                  <span className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                    <Avatar size="sm">
                      <AvatarImage src={v.owner.avatar_url ?? undefined} alt="" />
                      <AvatarFallback>{initials(v.owner.full_name)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{v.owner.full_name}</span>
                  </span>
                ) : <span />}
                {v.stage ? <Badge variant="outline" className="shrink-0">{stageLabel(v.stage)}</Badge> : null}
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </>
  );
}
