import Link from "next/link";
import type { ReactNode } from "react";
import { LEGAL } from "@/lib/constants";

/** Plantilla de lectura para documentos legales: índice + secciones numeradas. */
export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: ReactNode;
  sections: { id: string; title: string; body: ReactNode }[];
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 md:py-20">
      <p className="mb-2 text-xs font-bold tracking-[0.2em] text-gold-deep uppercase">Legal</p>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-balance md:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última actualización: {LEGAL.updated}</p>
      <div className="mt-6 text-base leading-relaxed text-foreground/85">{intro}</div>

      <nav aria-label="Contenido" className="mt-8 rounded-2xl border bg-card p-5">
        <p className="mb-2 text-sm font-semibold">Contenido</p>
        <ol className="grid gap-1 text-sm sm:grid-cols-2">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-muted-foreground hover:text-foreground hover:underline">
                {i + 1}. {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-10">
        {sections.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2 className="font-heading text-xl font-bold">
              {i + 1}. {s.title}
            </h2>
            <div className="mt-3 space-y-3 leading-relaxed text-foreground/85 [&_a]:font-medium [&_a]:text-gold-deep [&_a]:underline [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
              {s.body}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-14 rounded-2xl bg-cream p-5 text-sm">
        ¿Dudas sobre este documento? Escríbenos a <a href={`mailto:${LEGAL.email}`} className="font-semibold underline">{LEGAL.email}</a>.
        También puedes leer {title.startsWith("Aviso") ? <Link href="/terminos" className="font-semibold underline">los términos y condiciones</Link> : <Link href="/aviso-de-privacidad" className="font-semibold underline">el aviso de privacidad</Link>}.
      </p>
    </article>
  );
}
