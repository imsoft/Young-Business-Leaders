"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "@/actions/contact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FormMessage } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";

export function ContactForm() {
  const [state, action] = useActionState<ContactState, FormData>(sendContact, undefined);
  if (state?.ok) {
    return <FormMessage ok message="Recibimos tu mensaje. Te respondemos pronto." />;
  }
  return (
    <form action={action} className="grid gap-4">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <Field label="Nombre" htmlFor="name" error={state?.errors?.name}>
        <Input id="name" name="name" required autoComplete="name" />
      </Field>
      <Field label="Correo" htmlFor="email" error={state?.errors?.email}>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </Field>
      <Field label="Mensaje" htmlFor="message" error={state?.errors?.message}>
        <Textarea id="message" name="message" rows={5} required />
      </Field>
      <FormMessage message={state?.message} />
      <SubmitButton pendingText="Enviando…" className="font-semibold">
        Enviar mensaje
      </SubmitButton>
    </form>
  );
}
