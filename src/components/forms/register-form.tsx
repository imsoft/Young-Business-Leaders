"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpWithPassword, type AuthState } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Field, FormMessage } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";

export function RegisterForm() {
  const [state, action] = useActionState<AuthState, FormData>(signUpWithPassword, undefined);
  return (
    <form action={action} className="grid gap-4">
      <Field label="Nombre completo" htmlFor="full_name" error={state?.errors?.full_name}>
        <Input id="full_name" name="full_name" autoComplete="name" required />
      </Field>
      <Field label="Correo" htmlFor="email" error={state?.errors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Contraseña" htmlFor="password" error={state?.errors?.password} hint="Mínimo 8 caracteres">
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
      </Field>
      <Field label="Confirmar contraseña" htmlFor="confirm" error={state?.errors?.confirm}>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required />
      </Field>
      <FormMessage message={state?.message} />
      <SubmitButton pendingText="Creando cuenta…" className="w-full font-semibold">
        Crear cuenta
      </SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-foreground underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
