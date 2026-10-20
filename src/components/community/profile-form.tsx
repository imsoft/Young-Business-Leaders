"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "@/actions/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Field, FormMessage, NativeSelect } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";
import { INDUSTRIES } from "@/lib/constants";
import { initials } from "@/lib/format";
import type { Profile } from "@/lib/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action] = useActionState<ProfileState, FormData>(updateProfile, undefined);
  const e = state?.errors ?? {};
  return (
    <form action={action} className="grid gap-5">
      <div className="flex items-center gap-4">
        <Avatar className="size-20">
          <AvatarImage src={profile.avatar_url ?? undefined} alt="" />
          <AvatarFallback className="text-xl">{initials(profile.full_name || profile.email)}</AvatarFallback>
        </Avatar>
        <Field label="Foto de perfil" htmlFor="avatar" error={e.avatar} hint="JPG o PNG, máximo 3 MB" className="flex-1">
          <Input id="avatar" name="avatar" type="file" accept="image/*" />
        </Field>
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
        <Field label="Empresa o proyecto" htmlFor="company" error={e.company}>
          <Input id="company" name="company" defaultValue={profile.company ?? ""} />
        </Field>
        <Field label="Industria" htmlFor="industry" error={e.industry}>
          <NativeSelect id="industry" name="industry" defaultValue={profile.industry ?? ""}>
            <option value="">Selecciona</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </NativeSelect>
        </Field>
      </div>
      <Field label="Ciudad" htmlFor="city" error={e.city}>
        <Input id="city" name="city" defaultValue={profile.city ?? ""} />
      </Field>
      <Field label="Sobre ti y tu proyecto" htmlFor="bio" error={e.bio} hint="Qué haces, en qué etapa estás y qué buscas en la comunidad.">
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
        <Field label="Sitio web" htmlFor="website" error={e.website}>
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
