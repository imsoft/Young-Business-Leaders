import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Building2, Globe, MapPin } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "@/components/site/brand-icons";
import { requireMember } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { initials } from "@/lib/format";

export const metadata: Metadata = { title: "Miembro" };

export default function MemberPage({ params }: PageProps<"/comunidad/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-72 rounded-2xl" />}>
      <Body params={params} />
    </Suspense>
  );
}

async function Body({ params }: { params: PageProps<"/comunidad/[id]">["params"] }) {
  const { id } = await params;
  await requireMember(`/comunidad/${id}`);
  const supabase = await createClient();
  const { data: m } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (!m) notFound();

  const links = [
    m.instagram ? { icon: InstagramIcon, label: `@${m.instagram}`, href: `https://instagram.com/${m.instagram}` } : null,
    m.linkedin ? { icon: LinkedinIcon, label: "LinkedIn", href: m.linkedin } : null,
    m.website ? { icon: Globe, label: m.website.replace(/^https?:\/\//, ""), href: m.website } : null,
  ].filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/comunidad" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Directorio
      </Link>
      <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <Avatar className="size-28">
            <AvatarImage src={m.avatar_url ?? undefined} alt="" />
            <AvatarFallback className="text-3xl">{initials(m.full_name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-3xl font-extrabold">{m.full_name}</h1>
            {m.headline ? <p className="mt-1 text-lg text-muted-foreground">{m.headline}</p> : null}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {m.company ? <span className="inline-flex items-center gap-1"><Building2 className="size-4" />{m.company}</span> : null}
              {m.city ? <span className="inline-flex items-center gap-1"><MapPin className="size-4" />{m.city}</span> : null}
            </div>
            {m.industry ? <Badge variant="secondary" className="mt-3">{m.industry}</Badge> : null}
          </div>
        </div>
        {m.bio ? <p className="mt-8 whitespace-pre-line text-foreground/90">{m.bio}</p> : null}
        {links.length > 0 ? (
          <ul className="mt-8 flex flex-wrap gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:border-gold">
                  <l.icon className="size-4 text-gold-deep" /> {l.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
