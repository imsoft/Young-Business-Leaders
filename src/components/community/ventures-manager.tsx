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
import { ImagePicker } from "@/components/forms/image-picker";
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
  const hasContact = Boolean(
    venture && (venture.contact_phone || venture.contact_email || venture.instagram || venture.tiktok || venture.facebook || venture.linkedin),
  );

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
      <div className="grid gap-1.5">
        <span className="text-sm font-medium">Logo</span>
        <ImagePicker
          id={`v-logo-${key}`}
          name="logo"
          current={venture?.logo_url}
          fallback={(venture?.name ?? "?").trim().charAt(0).toUpperCase()}
          error={e.logo}
          hint="Cuadrado de preferencia. JPG, PNG o WebP, máximo 3 MB."
        />
        {venture?.logo_url ? (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" name="remove_logo" className="size-4 accent-[var(--ybl-gold)]" /> Quitar el logo actual
          </label>
        ) : null}
      </div>

      <details className="group rounded-xl border bg-muted/40 p-4" open={hasContact || Object.keys(e).some((k) => CONTACT_KEYS.includes(k))}>
        <summary className="cursor-pointer list-none text-sm font-semibold marker:hidden">
          <span className="inline-flex items-center gap-2">
            Contacto y redes sociales
            <span className="text-xs font-normal text-muted-foreground">opcional · solo lo ven miembros aprobados</span>
          </span>
        </summary>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Teléfono" htmlFor={`v-phone-${key}`} error={e.contact_phone}>
              <Input id={`v-phone-${key}`} name="contact_phone" type="tel" inputMode="tel" defaultValue={venture?.contact_phone ?? ""} placeholder="33 1234 5678" />
            </Field>
            <Field label="Correo" htmlFor={`v-email-${key}`} error={e.contact_email}>
              <Input id={`v-email-${key}`} name="contact_email" type="email" defaultValue={venture?.contact_email ?? ""} placeholder="hola@tuempresa.mx" />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="contact_whatsapp" defaultChecked={venture?.contact_whatsapp ?? false} className="size-4 accent-[var(--ybl-gold)]" />
            Este número tiene WhatsApp
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Instagram" htmlFor={`v-ig-${key}`} error={e.instagram}>
              <AtInput id={`v-ig-${key}`} name="instagram" defaultValue={venture?.instagram} />
            </Field>
            <Field label="TikTok" htmlFor={`v-tt-${key}`} error={e.tiktok}>
              <AtInput id={`v-tt-${key}`} name="tiktok" defaultValue={venture?.tiktok} />
            </Field>
            <Field label="Facebook" htmlFor={`v-fb-${key}`} error={e.facebook}>
              <Input id={`v-fb-${key}`} name="facebook" defaultValue={venture?.facebook ?? ""} placeholder="facebook.com/tuempresa" />
            </Field>
            <Field label="LinkedIn" htmlFor={`v-li-${key}`} error={e.linkedin}>
              <Input id={`v-li-${key}`} name="linkedin" defaultValue={venture?.linkedin ?? ""} placeholder="linkedin.com/company/tuempresa" />
            </Field>
          </div>
        </div>
      </details>
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

const CONTACT_KEYS = ["contact_phone", "contact_email", "instagram", "tiktok", "facebook", "linkedin"];

/** Campo de usuario de red social con @ fija; si la escriben o pegan, se quita. */
function AtInput({ id, name, defaultValue }: { id: string; name: string; defaultValue?: string | null }) {
  return (
    <div className="relative">
      <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">@</span>
      <Input
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        className="pl-6"
        onChange={(ev) => {
          const clean = ev.currentTarget.value.replace(/^@+/, "").replace(/\s/g, "");
          if (clean !== ev.currentTarget.value) ev.currentTarget.value = clean;
        }}
      />
    </div>
  );
}
