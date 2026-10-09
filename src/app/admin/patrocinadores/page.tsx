import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteSponsor } from "@/actions/admin";
import { SponsorForm } from "@/components/admin/sponsor-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Patrocinadores" };

export default function AdminPatrocinadoresPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="grid gap-6">
        <h1 className="font-heading text-2xl font-extrabold">Patrocinadores y aliados</h1>
        <Suspense fallback={<Skeleton className="h-64 rounded-2xl" />}>
          <Body />
        </Suspense>
      </div>
      <aside className="h-fit rounded-2xl border bg-card p-6">
        <h2 className="font-heading mb-4 text-lg font-bold">Agregar</h2>
        <SponsorForm />
      </aside>
    </div>
  );
}

async function Body() {
  await requireAdmin();
  const { data } = await createAdminClient().from("sponsors").select("*").order("sort_order");
  const sponsors = data ?? [];
  if (sponsors.length === 0) return <p className="text-muted-foreground">Agrega el primero con el formulario.</p>;
  return (
    <ul className="grid gap-4">
      {sponsors.map((s) => (
        <li key={s.id} className="rounded-2xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {s.logo_url ? <Image src={s.logo_url} alt="" width={96} height={40} className="h-8 w-auto object-contain" /> : null}
              <span className="font-medium">{s.name}</span>
              <span className="rounded bg-muted px-1.5 text-xs">{s.tier}</span>
              {!s.active ? <span className="text-xs text-muted-foreground">inactivo</span> : null}
            </div>
            <DeleteButton onConfirm={deleteSponsor.bind(null, s.id)} />
          </div>
          <details>
            <summary className="cursor-pointer text-sm text-muted-foreground">Editar</summary>
            <div className="mt-4"><SponsorForm sponsor={s} /></div>
          </details>
        </li>
      ))}
    </ul>
  );
}
