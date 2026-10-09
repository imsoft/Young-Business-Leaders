"use client";

import { useActionState, useState } from "react";
import { saveAlbum, type AdminState } from "@/actions/admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Field, FormMessage } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";
import { slugify } from "@/lib/slug";
import type { GalleryAlbum } from "@/lib/types";

export function AlbumForm({ album }: { album?: GalleryAlbum }) {
  const [state, action] = useActionState<AdminState, FormData>(saveAlbum, undefined);
  const [slug, setSlug] = useState(album?.slug ?? "");
  const [touched, setTouched] = useState(Boolean(album));
  const e = state?.errors ?? {};
  return (
    <form action={action} className="grid gap-5" encType="multipart/form-data">
      {album ? <input type="hidden" name="id" value={album.id} /> : null}
      <Field label="Título" htmlFor="title" error={e.title}>
        <Input id="title" name="title" defaultValue={album?.title} required onChange={(ev) => { if (!touched) setSlug(slugify(ev.currentTarget.value)); }} />
      </Field>
      <Field label="Slug" htmlFor="slug" error={e.slug} hint={`/galeria/${slug || "…"}`}>
        <Input id="slug" name="slug" value={slug} onChange={(ev) => { setTouched(true); setSlug(ev.currentTarget.value); }} required />
      </Field>
      <Field label="Descripción" htmlFor="description" error={e.description}>
        <Textarea id="description" name="description" rows={3} defaultValue={album?.description ?? ""} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Fecha del evento" htmlFor="event_date" error={e.event_date}>
          <Input id="event_date" name="event_date" type="date" defaultValue={album?.event_date ?? ""} />
        </Field>
        <Field label="Orden" htmlFor="sort_order" error={e.sort_order}>
          <Input id="sort_order" name="sort_order" type="number" defaultValue={album?.sort_order ?? 0} />
        </Field>
        <Field label="Portada" htmlFor="cover" error={e.cover}>
          <Input id="cover" name="cover" type="file" accept="image/*" />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Switch name="published" defaultChecked={album?.published ?? false} /> Publicado
      </label>
      <FormMessage message={state?.message} />
      <div><SubmitButton className="font-semibold">{album ? "Guardar" : "Crear álbum"}</SubmitButton></div>
    </form>
  );
}
