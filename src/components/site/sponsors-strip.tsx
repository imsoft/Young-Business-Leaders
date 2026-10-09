import Image from "next/image";
import { getSponsors } from "@/lib/data/public";

export async function SponsorsStrip({ title }: { title?: string }) {
  const sponsors = await getSponsors();
  if (sponsors.length === 0) return null;
  return (
    <>
    {title ? <p className="mb-6 text-center text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">{title}</p> : null}
    <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
      {sponsors.map((s) => {
        const content = s.logo_url ? (
          <Image src={s.logo_url} alt={s.name} width={140} height={56} className="h-10 w-auto object-contain opacity-80 transition hover:opacity-100" />
        ) : (
          <span className="font-heading text-lg font-bold text-muted-foreground">{s.name}</span>
        );
        return (
          <li key={s.id}>
            {s.website ? (
              <a href={s.website} target="_blank" rel="noreferrer" aria-label={s.name}>
                {content}
              </a>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
    </>
  );
}
