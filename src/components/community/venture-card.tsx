import { Globe, Mail, MessageCircle, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedinIcon, TikTokIcon } from "@/components/site/brand-icons";
import { whatsappLink } from "@/lib/validation";
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
        <VentureContact venture={venture} />
        {children}
      </div>
    </div>
  );
}

function VentureContact({ venture: v }: { venture: MemberVenture }) {
  const links = [
    v.contact_phone ? { href: `tel:${v.contact_phone.replace(/[^\d+]/g, "")}`, label: v.contact_phone, icon: Phone, external: false } : null,
    v.contact_phone && v.contact_whatsapp ? { href: whatsappLink(v.contact_phone), label: "WhatsApp", icon: MessageCircle, external: true } : null,
    v.contact_email ? { href: `mailto:${v.contact_email}`, label: v.contact_email, icon: Mail, external: false } : null,
    v.instagram ? { href: `https://instagram.com/${v.instagram}`, label: `@${v.instagram}`, icon: InstagramIcon, external: true } : null,
    v.tiktok ? { href: `https://www.tiktok.com/@${v.tiktok}`, label: `@${v.tiktok}`, icon: TikTokIcon, external: true } : null,
    v.facebook ? { href: v.facebook, label: "Facebook", icon: FacebookIcon, external: true } : null,
    v.linkedin ? { href: v.linkedin, label: "LinkedIn", icon: LinkedinIcon, external: true } : null,
  ].filter((l): l is NonNullable<typeof l> => Boolean(l));
  if (links.length === 0) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {links.map((l) => (
        <li key={l.href}>
          <a
            href={l.href}
            {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition hover:border-gold hover:text-gold-deep"
          >
            <l.icon className="size-3.5 shrink-0 text-gold-deep" />
            <span className="truncate">{l.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
