"use client";

import { useActionState, useState } from "react";
import { saveEvent, type AdminState } from "@/actions/admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Field, FormMessage } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";
import { isoToLocalDateTime } from "@/lib/format";
import { slugify } from "@/lib/slug";
import type { Event } from "@/lib/types";

export function EventForm({ event }: { event?: Event }) {
  const [state, action] = useActionState<AdminState, FormData>(saveEvent, undefined);
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(event));
  const e = state?.errors ?? {};
  return (
    <form action={action} className="grid gap-5" encType="multipart/form-data">
      {event ? <input type="hidden" name="id" value={event.id} /> : null}
      <Field label="Título" htmlFor="title" error={e.title}>
        <Input id="title" name="title" defaultValue={event?.title} required onChange={(ev) => { if (!slugTouched) setSlug(slugify(ev.currentTarget.value)); }} />
      </Field>
      <Field label="Slug (URL)" htmlFor="slug" error={e.slug} hint={`/eventos/${slug || "…"}`}>
        <Input id="slug" name="slug" value={slug} onChange={(ev) => { setSlugTouched(true); setSlug(ev.currentTarget.value); }} required />
      </Field>
      <Field label="Resumen" htmlFor="summary" error={e.summary} hint="Una o dos líneas para las tarjetas.">
        <Input id="summary" name="summary" defaultValue={event?.summary ?? ""} maxLength={200} />
      </Field>
      <Field label="Descripción" htmlFor="description" error={e.description}>
        <Textarea id="description" name="description" rows={8} defaultValue={event?.description ?? ""} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Inicio (hora de Guadalajara)" htmlFor="starts_at" error={e.starts_at}>
          <Input id="starts_at" name="starts_at" type="datetime-local" defaultValue={isoToLocalDateTime(event?.starts_at ?? null)} required />
        </Field>
        <Field label="Fin" htmlFor="ends_at" error={e.ends_at}>
          <Input id="ends_at" name="ends_at" type="datetime-local" defaultValue={isoToLocalDateTime(event?.ends_at ?? null)} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Lugar" htmlFor="location" error={e.location}>
          <Input id="location" name="location" defaultValue={event?.location ?? ""} />
        </Field>
        <Field label="Dirección" htmlFor="address" error={e.address}>
          <Input id="address" name="address" defaultValue={event?.address ?? ""} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Cupo" htmlFor="capacity" error={e.capacity} hint="Vacío = sin límite">
          <Input id="capacity" name="capacity" type="number" min={1} defaultValue={event?.capacity ?? ""} />
        </Field>
        <Field label="Portada" htmlFor="cover" error={e.cover} hint={event?.cover_url ? "Ya hay una portada; sube otra para reemplazarla." : "Imagen horizontal, máximo 6 MB"}>
          <Input id="cover" name="cover" type="file" accept="image/*" />
        </Field>
      </div>
      <div className="flex flex-wrap gap-8">
        <label className="flex items-center gap-2 text-sm">
          <Switch name="is_public" defaultChecked={event?.is_public ?? true} /> Abierto al público (sin cuenta)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch name="published" defaultChecked={event?.published ?? false} /> Publicado
        </label>
      </div>
      <Label className="sr-only">Guardar</Label>
      <FormMessage message={state?.message} />
      <div>
        <SubmitButton className="font-semibold">{event ? "Guardar cambios" : "Crear evento"}</SubmitButton>
      </div>
    </form>
  );
}
