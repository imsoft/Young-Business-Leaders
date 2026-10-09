"use client";

import { useActionState } from "react";
import { addPhotos, type AdminState } from "@/actions/admin";
import { Input } from "@/components/ui/input";
import { Field, FormMessage } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";

export function PhotoUploader({ albumId }: { albumId: string }) {
  const bound = addPhotos.bind(null, albumId);
  const [state, action] = useActionState<AdminState, FormData>(bound, undefined);
  return (
    <form action={action} className="grid gap-3" encType="multipart/form-data">
      <Field label="Agregar fotos" htmlFor="photos" error={state?.errors?.photos} hint="Puedes seleccionar varias. Máximo 6 MB cada una y ~8 MB por envío.">
        <Input id="photos" name="photos" type="file" accept="image/*" multiple required />
      </Field>
      <FormMessage message={state?.ok ? "Fotos agregadas." : state?.message} ok={state?.ok} />
      <div><SubmitButton pendingText="Subiendo…">Subir</SubmitButton></div>
    </form>
  );
}
