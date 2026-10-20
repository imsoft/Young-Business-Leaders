import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { NewPasswordForm } from "@/components/forms/reset-forms";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Nueva contraseña", robots: { index: false, follow: false } };

export default function ActualizarContrasenaPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold">Elige una contraseña nueva</h1>
        <p className="mt-1 text-sm text-muted-foreground">La usarás para entrar con tu correo a partir de ahora.</p>
      </div>
      <Suspense fallback={<Skeleton className="h-48 rounded-2xl" />}>
        <Guarded />
      </Suspense>
    </div>
  );
}

/** Solo con la sesión que abre el enlace del correo (o una sesión normal). */
async function Guarded() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?error=enlace");
  return <NewPasswordForm />;
}
