import { Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VENTURE_ROLES, VENTURE_STAGES } from "@/lib/constants";
import type { MemberVenture } from "@/lib/types";
import { cn } from "@/lib/utils";

export const roleLabel = (r: MemberVenture["role"]) => VENTURE_ROLES.find((x) => x.value === r)?.label ?? null;
export const stageLabel = (s: MemberVenture["stage"]) => VENTURE_STAGES.find((x) => x.value === s)?.label ?? null;

export function VentureLogo({ venture, className }: { venture: Pick<MemberVenture, "name" | "logo_url">; className?: string }) {
  return (
    <span className={cn("grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-accent font-heading text-lg font-extrabold text-gold-deep", className)}>
      {venture.logo_url ? (
        // Logos chicos ya optimizados a 256px WebP al subirse
        // eslint-disable-next-line @next/next/no-img-element
        <img src={venture.logo_url} alt="" width={48} height={48} className="size-full object-cover" loading="lazy" />
      ) : (
        venture.name.trim().charAt(0).toUpperCase()
      )}
    </span>
  );
}

export function VentureCard({ venture, primary = false, children }: { venture: MemberVenture; primary?: boolean; children?: React.ReactNode }) {
  const role = roleLabel(venture.role);
  const stage = stageLabel(venture.stage);
  return (
    <div className={cn("flex gap-4 rounded-2xl border bg-card p-4", primary && "border-gold/60")}>
      <VentureLogo venture={venture} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading font-bold">{venture.name}</h3>
          {primary ? <Badge className="bg-gold text-ink">Principal</Badge> : null}
        </div>
        {venture.tagline ? <p className="mt-0.5 text-sm text-muted-foreground">{venture.tagline}</p> : null}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {role ? <Badge variant="secondary">{role}</Badge> : null}
          {stage ? <Badge variant="outline">{stage}</Badge> : null}
          {venture.industry ? <Badge variant="outline">{venture.industry}</Badge> : null}
          {venture.website ? (
            <a href={venture.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-gold-deep hover:underline">
              <Globe className="size-3.5" /> {venture.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
            </a>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
