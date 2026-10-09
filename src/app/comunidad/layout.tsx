import Link from "next/link";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

/**
 * /comunidad/perfil es accesible para pendientes (deben completar su perfil);
 * el resto exige miembro aprobado. El guard vive en cada página.
 */
export default function CommunityLayout({ children }: LayoutProps<"/comunidad">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b bg-cream">
          <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 text-sm" aria-label="Comunidad">
            {[
              ["/comunidad", "Directorio"],
              ["/comunidad/eventos", "Mis eventos"],
              ["/comunidad/perfil", "Mi perfil"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-lg px-3 py-1.5 font-medium whitespace-nowrap hover:bg-accent">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
