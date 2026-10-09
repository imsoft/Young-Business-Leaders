"use client";

import { useActionState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { registerGuest, registerMember, unregisterMember, type RegistrationState } from "@/actions/events";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FormMessage } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";
import { cn } from "@/lib/utils";

type Props = {
  eventId: string;
  slug: string;
  isPublic: boolean;
  full: boolean;
  viewer: "anonymous" | "pending" | "member";
  registered: boolean;
};

export function EventRegistration({ eventId, slug, isPublic, full, viewer, registered }: Props) {
  if (viewer === "member") return <MemberButtons eventId={eventId} slug={slug} registered={registered} full={full} />;

  if (!isPublic) {
    return (
      <div className="rounded-2xl border bg-card p-5 text-sm">
        <p className="font-semibold">Evento exclusivo para miembros</p>
        <p className="mt-1 text-muted-foreground">
          {viewer === "pending"
            ? "Tu cuenta está en revisión. En cuanto te aprueben podrás registrarte."
            : "Crea tu cuenta y, una vez aprobada, podrás registrarte."}
        </p>
        {viewer === "anonymous" ? (
          <Link href={`/registro?next=/eventos/${slug}`} className={cn(buttonVariants(), "mt-4")}>
            Quiero ser miembro
          </Link>
        ) : null}
      </div>
    );
  }

  if (full) {
    return <p className="rounded-2xl border bg-card p-5 text-sm font-medium">El cupo está lleno.</p>;
  }

  return <GuestForm eventId={eventId} />;
}

function MemberButtons({ eventId, slug, registered, full }: { eventId: string; slug: string; registered: boolean; full: boolean }) {
  const [pending, start] = useTransition();
  if (registered) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-5 text-sm">
        <span className="inline-flex items-center gap-2 font-semibold text-green-700">
          <CheckCircle2 className="size-4" /> Ya estás registrado
        </span>
        <Button variant="ghost" size="sm" disabled={pending} onClick={() => start(async () => { await unregisterMember(eventId, slug); })}>
          Cancelar mi registro
        </Button>
      </div>
    );
  }
  if (full) return <p className="rounded-2xl border bg-card p-5 text-sm font-medium">El cupo está lleno.</p>;
  return (
    <Button size="lg" className="font-semibold" disabled={pending} onClick={() => start(async () => { await registerMember(eventId, slug); })}>
      {pending ? "Registrando…" : "Registrarme"}
    </Button>
  );
}

function GuestForm({ eventId }: { eventId: string }) {
  const [state, action] = useActionState<RegistrationState, FormData>(registerGuest, undefined);
  if (state?.ok) {
    return (
      <div className="rounded-2xl border bg-card p-5 text-sm">
        <p className="inline-flex items-center gap-2 font-semibold text-green-700">
          <CheckCircle2 className="size-4" /> {state.already ? "Ya estabas registrado" : "¡Listo, te esperamos!"}
        </p>
        <p className="mt-1 text-muted-foreground">Guarda la fecha. Si tienes dudas escríbenos por Instagram.</p>
      </div>
    );
  }
  return (
    <form action={action} className="grid gap-4 rounded-2xl border bg-card p-5">
      <p className="text-sm font-semibold">Regístrate al evento</p>
      <input type="hidden" name="event_id" value={eventId} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <Field label="Nombre" htmlFor="guest_name" error={state?.errors?.guest_name}>
        <Input id="guest_name" name="guest_name" required autoComplete="name" />
      </Field>
      <Field label="Correo" htmlFor="guest_email" error={state?.errors?.guest_email}>
        <Input id="guest_email" name="guest_email" type="email" required autoComplete="email" />
      </Field>
      <FormMessage message={state?.message} />
      <SubmitButton pendingText="Registrando…" className="font-semibold">
        Registrarme
      </SubmitButton>
      <p className="text-xs text-muted-foreground">
        ¿Ya eres miembro? <Link href="/login" className="underline">Inicia sesión</Link> para registrarte con tu cuenta.
      </p>
    </form>
  );
}
