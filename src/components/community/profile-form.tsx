"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "@/actions/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FormMessage, NativeSelect } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";
import { ImagePicker } from "@/components/forms/image-picker";
import { INDUSTRIES } from "@/lib/constants";
import { initials } from "@/lib/format";
import type { Profile } from "@/lib/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action] = useActionState<ProfileState, FormData>(updateProfile, undefined);
  const e = state?.errors ?? {};
  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-1.5">
        <span className="text-sm font-medium">Foto de perfil</span>
        <ImagePicker
          id="avatar"
          name="avatar"
          shape="circle"
          current={profile.avatar_url}
          fallback={initials(profile.full_name || profile.email)}
          error={e.avatar}
          hint="JPG, PNG o WebP, máximo 3 MB. Se recorta en cuadrado."
        />
      </div>
      <Field label="Nombre completo" htmlFor="full_name" error={e.full_name}>
        <Input id="full_name" name="full_name" defaultValue={profile.full_name} required />
      </Field>
      <Field label="¿A qué te dedicas?" htmlFor="headline" error={e.headline} hint="Aparece debajo de tu nombre en el directorio.">
        <Input
          id="headline"
          name="headline"
          defaultValue={profile.headline ?? ""}
          maxLength={100}
          placeholder="Ej. Cofundadora de Café Origen · Café de especialidad"
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tu industria" htmlFor="industry" error={e.industry}>
          <NativeSelect id="industry" name="industry" defaultValue={profile.industry ?? ""}>
            <option value="">Selecciona</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Ciudad" htmlFor="city" error={e.city}>
          <Input id="city" name="city" defaultValue={profile.city ?? ""} />
        </Field>
      </div>
      <Field label="Sobre ti" htmlFor="bio" error={e.bio} hint="Quién eres, qué te mueve y qué buscas en la comunidad. Tus emprendimientos van en su propia sección.">
        <Textarea id="bio" name="bio" rows={5} defaultValue={profile.bio ?? ""} maxLength={600} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Instagram" htmlFor="instagram" error={e.instagram}>
          <div className="relative">
            <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">
              @
            </span>
            <Input
              id="instagram"
              name="instagram"
              defaultValue={profile.instagram ?? ""}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              className="pl-6"
              onChange={(ev) => {
                // La @ ya está fija a la izquierda: si la escriben o pegan, se quita.
                const clean = ev.currentTarget.value.replace(/^@+/, "").replace(/\s/g, "");
                if (clean !== ev.currentTarget.value) ev.currentTarget.value = clean;
              }}
            />
          </div>
        </Field>
        <Field label="LinkedIn" htmlFor="linkedin" error={e.linkedin}>
          <Input id="linkedin" name="linkedin" type="url" placeholder="https://" defaultValue={profile.linkedin ?? ""} />
        </Field>
        <Field label="Sitio personal" htmlFor="website" error={e.website}>
          <Input id="website" name="website" type="url" placeholder="https://" defaultValue={profile.website ?? ""} />
        </Field>
      </div>
      <FormMessage message={state?.ok ? "Perfil guardado." : state?.message} ok={state?.ok} />
      <div>
        <SubmitButton className="font-semibold">Guardar perfil</SubmitButton>
      </div>
    </form>
  );
}
