import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Clock, XCircle } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { signOut } from "@/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Solicitud en revisión" };

export default function PendientePage() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

async function Body() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.status === "approved" || profile.is_admin) redirect("/comunidad");
  const rejected = profile.status === "rejected";
  return (
    <div className="grid gap-5">
      <span className={cn("grid size-12 place-items-center rounded-2xl", rejected ? "bg-destructive/10 text-destructive" : "bg-accent text-gold-deep")}>
        {rejected ? <XCircle /> : <Clock />}
      </span>
      <div>
        <h1 className="font-heading text-2xl font-extrabold">
          {rejected ? "Tu solicitud no fue aprobada" : "Tu solicitud está en revisión"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {rejected
            ? "Si crees que fue un error, escríbenos por Instagram o WhatsApp."
            : "El equipo de YBL revisa cada perfil. Mientras tanto completa tu perfil: una buena descripción de tu proyecto acelera la aprobación."}
        </p>
      </div>
      {!rejected ? (
        <Link href="/comunidad/perfil" className={cn(buttonVariants(), "font-semibold")}>
          Completar mi perfil
        </Link>
      ) : null}
      <form action={signOut}>
        <Button variant="ghost" type="submit">Cerrar sesión</Button>
      </form>
    </div>
  );
}
