"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Plus, Star } from "lucide-react";
import { deleteVenture, makePrimaryVenture, saveVenture, type VentureState } from "@/actions/ventures";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FormMessage, NativeSelect } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { VentureCard } from "@/components/community/venture-card";
import { INDUSTRIES, MAX_VENTURES, VENTURE_ROLES, VENTURE_STAGES } from "@/lib/constants";
import type { MemberVenture } from "@/lib/types";

export function VenturesManager({ ventures }: { ventures: MemberVenture[] }) {
  const [editing, setEditing] = useState<string | "new" | null>(ventures.length === 0 ? "new" : null);
  const [pending, start] = useTransition();
  const full = ventures.length >= MAX_VENTURES;

  return (
    <div className="grid gap-3" data-pending={pending || undefined}>
      {ventures.map((v, i) =>
        editing === v.id ? (
          <VentureForm key={v.id} venture={v} onDone={() => setEditing(null)} />
        ) : (
          <VentureCard key={v.id} venture={v} primary={i === 0 && ventures.length > 1}>
            <div className="mt-3 flex flex-wrap gap-1">
              <Button type="button" size="sm" variant="outline" onClick={() => setEditing(v.id)}>
                Editar
              </Button>
              {i > 0 ? (
                <Button type="button" size="sm" variant="ghost" disabled={pending} onClick={() => start(async () => { await makePrimaryVenture(v.id); })}>
                  <Star /> Hacer principal
                </Button>
              ) : null}
              <DeleteButton onConfirm={() => deleteVenture(v.id)} label="Eliminar" />
            </div>
          </VentureCard>
        ),
      )}
      {editing === "new" ? (
        <VentureForm onDone={() => setEditing(ventures.length === 0 ? "new" : null)} cancelable={ventures.length > 0} />
      ) : full ? (
        <p className="text-sm text-muted-foreground">Llegaste al máximo de {MAX_VENTURES} emprendimientos.</p>
      ) : (
        <Button type="button" variant="outline" className="justify-self-start" onClick={() => setEditing("new")}>
          <Plus /> Agregar emprendimiento
        </Button>
      )}
    </div>
  );
}

function VentureForm({ venture, onDone, cancelable = true }: { venture?: MemberVenture; onDone: () => void; cancelable?: boolean }) {
  const [state, action] = useActionState<VentureState, FormData>(saveVenture, undefined);
  const e = state?.errors ?? {};
  const key = venture?.id ?? "new";

  useEffect(() => {
    if (state?.ok) onDone();
    // onDone cambia en cada render del padre; solo importa el resultado del guardado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={action} className="grid gap-4 rounded-2xl border border-gold/50 bg-card p-5">
      <p className="font-heading font-bold">{venture ? `Editar ${venture.name}` : "Nuevo emprendimiento"}</p>
      {venture ? <input type="hidden" name="id" value={venture.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" htmlFor={`v-name-${key}`} error={e.name}>
          <Input id={`v-name-${key}`} name="name" defaultValue={venture?.name} required maxLength={80} placeholder="Ej. Café Origen" />
        </Field>
        <Field label="Tu rol" htmlFor={`v-role-${key}`} error={e.role}>
          <NativeSelect id={`v-role-${key}`} name="role" defaultValue={venture?.role ?? ""}>
            <option value="">Selecciona</option>
            {VENTURE_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </NativeSelect>
        </Field>
      </div>
      <Field label="¿Qué hace?" htmlFor={`v-tagline-${key}`} error={e.tagline} hint="Una línea, como se lo dirías a alguien en un evento.">
        <Input id={`v-tagline-${key}`} name="tagline" defaultValue={venture?.tagline ?? ""} maxLength={140} placeholder="Ej. Café de especialidad de productores de Jalisco" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Etapa" htmlFor={`v-stage-${key}`} error={e.stage}>
          <NativeSelect id={`v-stage-${key}`} name="stage" defaultValue={venture?.stage ?? ""}>
            <option value="">Selecciona</option>
            {VENTURE_STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </NativeSelect>
        </Field>
        <Field label="Industria" htmlFor={`v-industry-${key}`} error={e.industry}>
          <NativeSelect id={`v-industry-${key}`} name="industry" defaultValue={venture?.industry ?? ""}>
            <option value="">Selecciona</option>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </NativeSelect>
        </Field>
        <Field label="Sitio web" htmlFor={`v-website-${key}`} error={e.website}>
          <Input id={`v-website-${key}`} name="website" type="url" placeholder="https://" defaultValue={venture?.website ?? ""} />
        </Field>
      </div>
      <Field label="Logo" htmlFor={`v-logo-${key}`} error={e.logo} hint="Cuadrado de preferencia. JPG, PNG o WebP, máximo 3 MB.">
        <Input id={`v-logo-${key}`} name="logo" type="file" accept="image/png,image/jpeg,image/webp" />
      </Field>
      {venture?.logo_url ? (
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" name="remove_logo" className="size-4 accent-[var(--ybl-gold)]" /> Quitar el logo actual
        </label>
      ) : null}
      <FormMessage message={state?.message} />
      <div className="flex gap-2">
        <SubmitButton className="font-semibold">{venture ? "Guardar cambios" : "Agregar"}</SubmitButton>
        {cancelable ? (
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancelar
          </Button>
        ) : null}
      </div>
    </form>
  );
}
