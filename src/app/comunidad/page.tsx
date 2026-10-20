import { getVentures, profileIdsByVentureIndustry } from "@/lib/data/ventures";
import type { Metadata } from "next";
import { Suspense } from "react";
import { requireMember } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { MemberCard } from "@/components/community/member-card";
import { DirectoryFilters } from "@/components/community/directory-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { sanitizeSearch } from "@/lib/search";
import { INDUSTRIES } from "@/lib/constants";

export const metadata: Metadata = { title: "Directorio de miembros" };

export default function DirectoryPage({ searchParams }: PageProps<"/comunidad">) {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold">Directorio</h1>
        <p className="text-muted-foreground">Miembros aprobados de la comunidad YBL.</p>
      </div>
      <Suspense>
        <DirectoryFilters />
      </Suspense>
      <Suspense fallback={<Grid skeleton />}>
        <Members searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Members({ searchParams }: { searchParams: PageProps<"/comunidad">["searchParams"] }) {
  await requireMember("/comunidad");
  const sp = await searchParams;
  const q = sanitizeSearch(sp.q);
  const industria = INDUSTRIES.find((i) => i === sp.industria) ?? "";

  const supabase = await createClient();
  let query = supabase
    .from("profiles")
    .select("id, full_name, avatar_url, headline, company, industry, city")
    .eq("status", "approved")
    .order("full_name", { ascending: true })
    .limit(200);
  if (industria) {
    // La industria del miembro o la de cualquiera de sus emprendimientos
    const ids = await profileIdsByVentureIndustry(industria);
    query = ids.length
      ? query.or(`industry.eq."${industria}",id.in.(${ids.join(",")})`)
      : query.eq("industry", industria);
  }
  if (q) {
    const like = `%${q}%`;
    query = query.or(`full_name.ilike.${like},company.ilike.${like},city.ilike.${like},headline.ilike.${like}`);
  }
  const { data } = await query;
  const members = data ?? [];
  const ventures = await getVentures(members.map((m) => m.id));
  const ventureCount = new Map<string, number>();
  for (const v of ventures) ventureCount.set(v.profile_id, (ventureCount.get(v.profile_id) ?? 0) + 1);
  if (members.length === 0) {
    return <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">No encontramos miembros con esos filtros.</p>;
  }
  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((m) => (
        <StaggerItem key={m.id}><MemberCard member={m} ventures={ventureCount.get(m.id) ?? 0} /></StaggerItem>
      ))}
    </Stagger>
  );
}

function Grid({ children, skeleton }: { children?: React.ReactNode; skeleton?: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skeleton ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />) : children}
    </div>
  );
}
