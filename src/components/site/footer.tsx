import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { InstagramIcon } from "./brand-icons";
import { Logo } from "./logo";
import { INSTAGRAM_URL, WHATSAPP_URL, SITE_TAGLINE } from "@/lib/constants";
import { cacheLife } from "next/cache";

async function Year() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4 sm:col-span-2 md:col-span-1">
          <Logo dark />
          <p className="max-w-sm text-sm text-white/70">{SITE_TAGLINE} 🚀 Una comunidad de jóvenes emprendedores en Jalisco.</p>
          <div className="flex gap-2">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-gold hover:text-ink">
              <InstagramIcon className="size-5" />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-gold hover:text-ink">
              <MessageCircle className="size-5" />
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold tracking-widest text-gold uppercase">Explora</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/nosotros" className="hover:text-white">Nosotros</Link></li>
            <li><Link href="/eventos" className="hover:text-white">Eventos</Link></li>
            <li><Link href="/galeria" className="hover:text-white">Galería</Link></li>
            <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold tracking-widest text-gold uppercase">Comunidad</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/registro" className="hover:text-white">Únete a YBL</Link></li>
            <li><Link href="/login" className="hover:text-white">Iniciar sesión</Link></li>
            <li><Link href="/comunidad" className="hover:text-white">Directorio de miembros</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© <Year /> Young Business Leaders MX · Guadalajara, Jalisco</p>
          <p>
            Desarrollado por{" "}
            <a href="https://imsoft.io" target="_blank" rel="noreferrer" className="font-semibold text-white/70 transition-colors hover:text-gold">
              imSoft
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
