import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "./logo";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { NavLink } from "./nav-link";

const LINKS = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/eventos", label: "Eventos" },
  { href: "/galeria", label: "Galería" },
  { href: "/comunidad", label: "Comunidad" },
  { href: "/contacto", label: "Contacto" },
];

const LINK_CLASS =
  "relative rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-gold after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100";

export function SiteHeader() {
  return (
    <>
    <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-white">
      Ir al contenido
    </a>
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          <Suspense fallback={LINKS.map((l) => <Link key={l.href} href={l.href} className={LINK_CLASS}>{l.label}</Link>)}>
            {LINKS.map((l) => (
              <NavLink key={l.href} href={l.href} className={LINK_CLASS}>
                {l.label}
              </NavLink>
            ))}
          </Suspense>
        </nav>
        <div className="flex items-center gap-2">
          <UserMenu />
          <div className="md:hidden">
            <MobileNav links={LINKS} />
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
