import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { formatShortDate } from "@/lib/format";

export const metadata: Metadata = { title: "Mensajes" };

export default function MensajesPage() {
  return (
    <div className="grid gap-6">
      <h1 className="font-heading text-2xl font-extrabold">Mensajes de contacto</h1>
      <Suspense fallback={<Skeleton className="h-64 rounded-2xl" />}>
        <Body />
      </Suspense>
    </div>
  );
}

async function Body() {
  await requireAdmin();
  const { data } = await createAdminClient().from("contact_messages").select("*").order("created_at", { ascending: false }).limit(200);
  const rows = data ?? [];
  if (rows.length === 0) return <p className="text-muted-foreground">Sin mensajes todavía.</p>;
  return (
    <ul className="grid gap-3">
      {rows.map((m) => (
        <li key={m.id} className="rounded-2xl border bg-card p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-semibold">{m.name} <a href={`mailto:${m.email}`} className="ml-2 text-sm font-normal text-muted-foreground underline">{m.email}</a></p>
            <span className="text-xs text-muted-foreground">{formatShortDate(m.created_at)}</span>
          </div>
          <p className="mt-2 text-sm whitespace-pre-line">{m.message}</p>
        </li>
      ))}
    </ul>
  );
}
