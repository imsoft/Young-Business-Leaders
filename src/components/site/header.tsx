import Link from "next/link";
import { Logo } from "./logo";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";

const LINKS = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/eventos", label: "Eventos" },
  { href: "/galeria", label: "Galería" },
  { href: "/comunidad", label: "Comunidad" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-gold after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <UserMenu />
          <div className="md:hidden">
            <MobileNav links={LINKS} />
          </div>
        </div>
      </div>
    </header>
  );
}
