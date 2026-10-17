import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";
import { GoogleButton } from "@/components/forms/google-button";
import { Separator } from "@/components/ui/separator";
import { FormMessage } from "@/components/forms/field";

export const metadata: Metadata = {
  title: "Únete a la comunidad",
  description:
    "Crea tu cuenta en Young Business Leaders MX y solicita acceso al directorio de jóvenes emprendedores de Jalisco y a los eventos para miembros.",
  alternates: { canonical: "/registro" },
};

export default function RegistroPage({ searchParams }: PageProps<"/registro">) {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold">Únete a YBL</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crea tu cuenta y completa tu perfil. El equipo de YBL revisa cada solicitud antes de darte acceso al
          directorio.
        </p>
      </div>
      <Suspense>
        <Body searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Body({ searchParams }: { searchParams: PageProps<"/registro">["searchParams"] }) {
  const sp = await searchParams;
  if (sp.check) {
    return (
      <FormMessage ok message="Te mandamos un correo para confirmar tu cuenta. Revisa tu bandeja (y spam)." />
    );
  }
  const next = typeof sp.next === "string" ? sp.next : "/comunidad/perfil";
  return (
    <>
      <GoogleButton next={next} label="Registrarme con Google" />
      <p className="-mt-3 text-center text-xs text-muted-foreground">
        Con Google también aceptas los{" "}
        <Link href="/terminos" className="underline hover:text-foreground">términos</Link> y el{" "}
        <Link href="/aviso-de-privacidad" className="underline hover:text-foreground">aviso de privacidad</Link>.
      </p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <Separator className="flex-1" /> o con tu correo <Separator className="flex-1" />
      </div>
      <RegisterForm />
    </>
  );
}
