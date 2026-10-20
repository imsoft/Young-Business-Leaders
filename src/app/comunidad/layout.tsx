import type { Metadata } from "next";
import { CommunityNav } from "@/components/community/community-nav";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

/**
 * /comunidad/perfil es accesible para pendientes (deben completar su perfil);
 * el resto exige miembro aprobado. El guard vive en cada página.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function CommunityLayout({ children }: LayoutProps<"/comunidad">) {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="flex-1">
        <div className="border-b bg-cream">
          <CommunityNav />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
