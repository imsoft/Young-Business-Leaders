"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInWithPassword, type AuthState } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Field, FormMessage } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<AuthState, FormData>(signInWithPassword, undefined);
  return (
    <form action={action} className="grid gap-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field label="Correo" htmlFor="email" error={state?.errors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Contraseña" htmlFor="password" error={state?.errors?.password}>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <FormMessage message={state?.message} />
      <SubmitButton pendingText="Entrando…" className="w-full font-semibold">
        Iniciar sesión
      </SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link href={next ? `/registro?next=${encodeURIComponent(next)}` : "/registro"} className="font-medium text-foreground underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
