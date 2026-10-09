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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Lee la sesión, así que siempre va dentro de Suspense. */
async function UserMenuInner() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
          Iniciar sesión
        </Link>
        <Link href="/registro" className={cn(buttonVariants({ variant: "default" }), "font-semibold")}>
          Únete
        </Link>
      </div>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <Avatar size="default">
          <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name} />
          <AvatarFallback>{initials(profile.full_name || profile.email)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="truncate font-medium">{profile.full_name || "Miembro"}</div>
            <div className="truncate text-xs text-muted-foreground">{profile.email}</div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/comunidad" />}>Comunidad</DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/comunidad/eventos" />}>Mis eventos</DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/comunidad/perfil" />}>Mi perfil</DropdownMenuItem>
        {profile.is_admin ? (
          <DropdownMenuItem render={<Link href="/admin" />}>Administración</DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <form action={signOut}>
          <DropdownMenuItem nativeButton render={<button type="submit" className="w-full" />}>
            Cerrar sesión
          </DropdownMenuItem>
        </form>
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
