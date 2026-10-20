"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, updatePassword, type ResetState } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Field, FormMessage } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";
import { Turnstile } from "@/components/forms/turnstile";

export function RequestResetForm() {
  const [state, action] = useActionState<ResetState, FormData>(requestPasswordReset, undefined);
  if (state?.ok) {
    return (
      <div className="grid gap-4">
        <FormMessage ok message="Si hay una cuenta con ese correo, te enviamos un enlace para elegir una contraseña nueva. Revisa también spam." />
        <Link href="/login" className="text-center text-sm underline">Volver a iniciar sesión</Link>
      </div>
    );
  }
  return (
    <form action={action} className="grid gap-4">
      <Field label="Correo de tu cuenta" htmlFor="email" error={state?.errors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Turnstile resetKey={state} />
      <FormMessage message={state?.message} />
      <SubmitButton pendingText="Enviando…" className="w-full font-semibold">
        Enviarme el enlace
      </SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        ¿Te acordaste? <Link href="/login" className="font-medium text-foreground underline">Inicia sesión</Link>
      </p>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action] = useActionState<ResetState, FormData>(updatePassword, undefined);
  return (
    <form action={action} className="grid gap-4">
      <Field label="Contraseña nueva" htmlFor="password" error={state?.errors?.password} hint="Mínimo 8 caracteres">
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
      </Field>
      <Field label="Confirma la contraseña" htmlFor="confirm" error={state?.errors?.confirm}>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required />
      </Field>
      <FormMessage message={state?.message} />
      <SubmitButton pendingText="Guardando…" className="w-full font-semibold">
        Guardar contraseña
      </SubmitButton>
    </form>
  );
}
