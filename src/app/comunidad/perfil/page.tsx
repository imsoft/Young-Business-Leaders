import type { Metadata } from "next";
import { Suspense } from "react";
import { requireProfile } from "@/lib/auth";
import { ProfileForm } from "@/components/community/profile-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Mi perfil" };

export default function PerfilPage({ searchParams }: PageProps<"/comunidad/perfil">) {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading text-3xl font-extrabold">Mi perfil</h1>
      <p className="mb-8 text-muted-foreground">Así te verán los demás miembros en el directorio.</p>
      <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
        <Body searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Body({ searchParams }: { searchParams: PageProps<"/comunidad/perfil">["searchParams"] }) {
  const [profile, sp] = await Promise.all([requireProfile("/comunidad/perfil"), searchParams]);
  return (
    <div className="grid gap-6">
      {sp.welcome ? (
        <Alert>
          <AlertTitle>¡Bienvenido a YBL!</AlertTitle>
          <AlertDescription>
            Completa tu perfil para que el equipo pueda revisar tu solicitud. Te avisaremos cuando quede aprobada.
          </AlertDescription>
        </Alert>
      ) : profile.status === "pending" ? (
        <Alert>
          <AlertTitle>Tu cuenta está en revisión</AlertTitle>
          <AlertDescription>Mientras tanto puedes completar tu perfil.</AlertDescription>
        </Alert>
      ) : null}
      <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
