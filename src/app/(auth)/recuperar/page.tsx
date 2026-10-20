import type { Metadata } from "next";
import { RequestResetForm } from "@/components/forms/reset-forms";

export const metadata: Metadata = { title: "Recuperar contraseña", robots: { index: false, follow: true } };

export default function RecuperarPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold">Recupera tu contraseña</h1>
        <p className="mt-1 text-sm text-muted-foreground">Escribe el correo de tu cuenta y te enviaremos un enlace para elegir una nueva.</p>
      </div>
      <RequestResetForm />
    </div>
  );
}
