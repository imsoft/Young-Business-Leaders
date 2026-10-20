import Link from "next/link";
import { Suspense } from "react";
import { getCurrentProfile } from "@/lib/auth";
import { signOut } from "@/actions/auth";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, LogOut, Pencil, ShieldCheck, UserRoundPen, Users, X } from "lucide-react";
import { initials } from "@/lib/format";
import { DeveloperBadge } from "@/components/community/developer-badge";
import { cn } from "@/lib/utils";

/** Lee la sesión, así que siempre va dentro de Suspense. */
async function UserMenuInner() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}>
          Iniciar sesión
        </Link>
        <Link href="/registro" className={cn(buttonVariants({ variant: "default" }), "font-semibold")}>
          Únete
        </Link>
      </div>
    );
  }
  const role = profile.is_admin ? "Admin" : profile.status === "approved" ? "Miembro" : profile.status === "pending" ? "En revisión" : "No aprobado";
  const name = profile.full_name || "Miembro";
  const tile =
    "flex w-full items-center gap-3 bg-card px-4 py-3 text-sm font-medium text-foreground outline-none transition-colors data-highlighted:bg-accent [&_svg]:size-[18px] [&_svg]:text-gold-deep";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Abrir menú de tu cuenta"
        className="rounded-full outline-none ring-offset-2 ring-offset-background transition focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:ring-2 data-popup-open:ring-gold"
      >
        <Avatar size="default">
          <AvatarImage src={profile.avatar_url ?? undefined} alt="" />
          <AvatarFallback>{initials(name || profile.email)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="relative w-[min(22rem,calc(100vw-1.5rem))] rounded-[28px] bg-muted p-2.5 shadow-2xl ring-1 ring-foreground/10"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0">
            <div className="relative flex items-center gap-3.5 rounded-[22px] bg-card p-4 pr-12">
              <div className="relative shrink-0">
                <Avatar className="size-14">
                  <AvatarImage src={profile.avatar_url ?? undefined} alt="" />
                  <AvatarFallback className="text-lg">{initials(name || profile.email)}</AvatarFallback>
                </Avatar>
                <span className="absolute -right-1 -bottom-1 grid size-6 place-items-center rounded-full bg-ink text-white ring-2 ring-card">
                  <Pencil className="size-3" />
                </span>
              </div>
              <div className="min-w-0 text-left">
                <p className="truncate text-base font-semibold text-foreground">{name}</p>
                <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
                <span
                  className={cn(
                    "mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                    profile.is_admin ? "bg-ink text-white" : profile.status === "approved" ? "bg-accent text-gold-deep" : "bg-muted text-muted-foreground",
                  )}
                >
                  {role}
                </span>
                <DeveloperBadge profileId={profile.id} compact className="mt-1.5 ml-1" />
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuItem
          aria-label="Cerrar menú"
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-full p-0 text-muted-foreground data-highlighted:bg-muted"
        >
          <X className="size-4" />
        </DropdownMenuItem>

        <div className="mt-2 grid gap-0.5 overflow-hidden rounded-[22px]">
          <DropdownMenuItem className={tile} render={<Link href="/comunidad" />}>
            <Users /> Directorio de miembros
          </DropdownMenuItem>
          <DropdownMenuItem className={tile} render={<Link href="/comunidad/eventos" />}>
            <CalendarDays /> Mis eventos
          </DropdownMenuItem>
          {profile.is_admin ? (
            <DropdownMenuItem className={tile} render={<Link href="/admin" />}>
              <ShieldCheck /> Administración
            </DropdownMenuItem>
          ) : null}
        </div>

        <DropdownMenuItem
          className={cn(tile, "mt-2 rounded-full px-5")}
          render={<Link href="/comunidad/perfil" />}
        >
          <UserRoundPen /> Editar mi perfil
        </DropdownMenuItem>
        <form action={signOut}>
          <DropdownMenuItem nativeButton className={cn(tile, "mt-2 rounded-full px-5")} render={<button type="submit" />}>
            <LogOut /> Cerrar sesión
          </DropdownMenuItem>
        </form>

        <div className="flex items-center justify-center gap-1 pt-3 pb-1 text-xs text-muted-foreground">
          <DropdownMenuItem
            className="rounded-md px-1.5 py-0.5 text-xs text-muted-foreground data-highlighted:bg-transparent data-highlighted:text-foreground data-highlighted:underline"
            render={<Link href="/aviso-de-privacidad" />}
          >
            Aviso de privacidad
          </DropdownMenuItem>
          <span aria-hidden="true">•</span>
          <DropdownMenuItem
            className="rounded-md px-1.5 py-0.5 text-xs text-muted-foreground data-highlighted:bg-transparent data-highlighted:text-foreground data-highlighted:underline"
            render={<Link href="/terminos" />}
          >
            Términos
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserMenu() {
  return (
    <Suspense fallback={<Skeleton className="h-8 w-28 rounded-full" />}>
      <UserMenuInner />
    </Suspense>
  );
}
