import Link from "next/link";
import { Suspense } from "react";
import { NavLink } from "@/components/site/nav-link";

const TABS = [
  ["/comunidad", "Miembros"],
  ["/comunidad/emprendimientos", "Emprendimientos"],
  ["/comunidad/eventos", "Mis eventos"],
  ["/comunidad/perfil", "Mi perfil"],
] as const;

const TAB = "rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-colors hover:bg-accent aria-[current=page]:bg-ink aria-[current=page]:text-white";

/** Pestañas de la comunidad con la activa resaltada ("Miembros" solo en /comunidad exacto). */
export function CommunityNav() {
  return (
    <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 text-sm" aria-label="Comunidad">
      <Suspense fallback={TABS.map(([href, label]) => <Link key={href} href={href} className={TAB}>{label}</Link>)}>
        {TABS.map(([href, label]) => (
          <NavLink key={href} href={href} exact={href === "/comunidad"} className={TAB}>
            {label}
          </NavLink>
        ))}
      </Suspense>
    </nav>
  );
}
