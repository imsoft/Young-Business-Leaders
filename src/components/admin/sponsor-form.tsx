"use client";

import { useActionState } from "react";
import { saveSponsor, type AdminState } from "@/actions/admin";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Field, FormMessage, NativeSelect } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";
import { SPONSOR_TIERS } from "@/lib/constants";
import type { Sponsor } from "@/lib/types";

export function SponsorForm({ sponsor }: { sponsor?: Sponsor }) {
  const [state, action] = useActionState<AdminState, FormData>(saveSponsor, undefined);
  const e = state?.errors ?? {};
  return (
    <form action={action} className="grid gap-4">
      {sponsor ? <input type="hidden" name="id" value={sponsor.id} /> : null}
      <Field label="Nombre" htmlFor={`name-${sponsor?.id ?? "new"}`} error={e.name}>
        <Input id={`name-${sponsor?.id ?? "new"}`} name="name" defaultValue={sponsor?.name} required />
      </Field>
      <Field label="Sitio web" htmlFor={`website-${sponsor?.id ?? "new"}`} error={e.website}>
        <Input id={`website-${sponsor?.id ?? "new"}`} name="website" type="url" placeholder="https://" defaultValue={sponsor?.website ?? ""} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nivel" htmlFor={`tier-${sponsor?.id ?? "new"}`} error={e.tier}>
          <NativeSelect id={`tier-${sponsor?.id ?? "new"}`} name="tier" defaultValue={sponsor?.tier ?? "aliado"}>
            {SPONSOR_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
          </NativeSelect>
        </Field>
        <Field label="Orden" htmlFor={`order-${sponsor?.id ?? "new"}`} error={e.sort_order}>
          <Input id={`order-${sponsor?.id ?? "new"}`} name="sort_order" type="number" defaultValue={sponsor?.sort_order ?? 0} />
        </Field>
      </div>
      <Field label="Logo" htmlFor={`logo-${sponsor?.id ?? "new"}`} error={e.logo} hint="PNG o SVG con fondo transparente">
        <Input id={`logo-${sponsor?.id ?? "new"}`} name="logo" type="file" accept="image/*" />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <Switch name="active" defaultChecked={sponsor?.active ?? true} /> Activo
      </label>
      <FormMessage message={state?.ok ? "Guardado." : state?.message} ok={state?.ok} />
      <div><SubmitButton size="sm">{sponsor ? "Guardar" : "Agregar"}</SubmitButton></div>
    </form>
  );
}
