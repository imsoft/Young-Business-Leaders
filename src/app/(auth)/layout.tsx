import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { HeroGlow, HeroIntro, HeroLine } from "@/components/motion/hero";
import { PageTransition } from "@/components/motion/page-transition";
import { Duotone } from "@/components/media/duotone";
import { siteMedia } from "@/lib/media";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col p-6 md:p-10">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <PageTransition>{children}</PageTransition>
        </div>
        <p className="text-xs text-muted-foreground">
          <Link href="/" className="hover:underline">← Volver al sitio</Link>
        </p>
      </div>
      <div className="relative hidden overflow-hidden bg-gold-gradient lg:block">
        <Duotone image={siteMedia.auth} className="opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gold via-gold/40 to-transparent" />
        <HeroGlow />
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />
        <HeroIntro className="relative flex h-full flex-col justify-end p-12 text-ink">
          <HeroLine>
            <p className="font-heading text-4xl font-extrabold tracking-tight text-balance">
              Jóvenes que conectan un Jalisco más grande.
            </p>
          </HeroLine>
          <HeroLine>
            <p className="mt-3 max-w-md text-ink/80">
              Únete al directorio, regístrate a reuniones exclusivas y conoce a otros emprendedores.
            </p>
          </HeroLine>
        </HeroIntro>
      </div>
    </div>
  );
}
