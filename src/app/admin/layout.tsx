import Link from "next/link";
import { Suspense } from "react";
import { CalendarDays, Handshake, Images, Inbox, LayoutDashboard, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { Logo } from "@/components/site/logo";
import { UserMenu } from "@/components/site/user-menu";
import { Skeleton } from "@/components/ui/skeleton";

const NAV = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/miembros", label: "Miembros", icon: Users },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/galeria", label: "Galería", icon: Images },
  { href: "/admin/patrocinadores", label: "Patrocinadores", icon: Handshake },
  { href: "/admin/mensajes", label: "Mensajes", icon: Inbox },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-md bg-ink px-2 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase">Admin</span>
          </div>
          <UserMenu />
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8">
        <aside className="hidden w-52 shrink-0 md:block">
          <nav className="grid gap-1" aria-label="Administración">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent">
                <Icon className="size-4 text-gold-deep" /> {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <nav className="mb-6 flex gap-1 overflow-x-auto md:hidden" aria-label="Administración">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className="rounded-lg bg-muted px-3 py-1.5 text-sm font-medium whitespace-nowrap">{label}</Link>
            ))}
          </nav>
          <Suspense fallback={<Skeleton className="h-64 rounded-2xl" />}>
            <Guard>{children}</Guard>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function Guard({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
