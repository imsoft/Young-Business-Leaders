import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/login-form";
import { GoogleButton } from "@/components/forms/google-button";
import { Separator } from "@/components/ui/separator";
import { FormMessage } from "@/components/forms/field";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold">Bienvenido de vuelta</h1>
        <p className="mt-1 text-sm text-muted-foreground">Entra a la comunidad YBL.</p>
      </div>
      <Suspense>
        <Body searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Body({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;
  const error = typeof sp.error === "string" ? sp.error : undefined;
  return (
    <>
      {error ? <FormMessage message="No pudimos completar el inicio de sesión. Intenta de nuevo." /> : null}
      <GoogleButton next={next} />
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <Separator className="flex-1" /> o con tu correo <Separator className="flex-1" />
      </div>
      <LoginForm next={next} />
    </>
  );
}
