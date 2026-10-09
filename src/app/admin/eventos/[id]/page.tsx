import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteEvent } from "@/actions/admin";
import { EventForm } from "@/components/admin/event-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { FormMessage } from "@/components/forms/field";
import { Skeleton } from "@/components/ui/skeleton";
import { formatShortDate } from "@/lib/format";

export const metadata: Metadata = { title: "Editar evento" };

export default function EditarEventoPage({ params, searchParams }: PageProps<"/admin/eventos/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
      <Body params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Body({ params, searchParams }: { params: PageProps<"/admin/eventos/[id]">["params"]; searchParams: PageProps<"/admin/eventos/[id]">["searchParams"] }) {
  await requireAdmin();
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const admin = createAdminClient();
  const { data: event } = await admin.from("events").select("*").eq("id", id).maybeSingle();
  if (!event) notFound();
  const { data: regs } = await admin
    .from("event_registrations")
    .select("id, guest_name, guest_email, created_at, profiles(full_name, email)")
    .eq("event_id", id)
    .order("created_at", { ascending: false });
  type Reg = { id: string; guest_name: string | null; guest_email: string | null; created_at: string; profiles: { full_name: string; email: string } | null };
  const rows = (regs ?? []) as unknown as Reg[];
  const remove = deleteEvent.bind(null, event.id);

  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-extrabold">Editar evento</h1>
        <div className="flex items-center gap-2">
          {event.published ? <Link href={`/eventos/${event.slug}`} className="text-sm underline" target="_blank">Ver público</Link> : null}
          <DeleteButton onConfirm={remove} />
        </div>
      </div>
      {sp.saved ? <FormMessage ok message="Evento guardado." /> : null}
      <div className="rounded-2xl border bg-card p-6">
        <EventForm event={event} />
      </div>
      <section className="rounded-2xl border bg-card p-6">
        <h2 className="font-heading mb-3 text-lg font-bold">Registros ({rows.length})</h2>
        {rows.length === 0 ? <p className="text-sm text-muted-foreground">Nadie se ha registrado todavía.</p> : (
          <ul className="divide-y text-sm">
            {rows.map((r) => (
              <li key={r.id} className="flex justify-between gap-3 py-2">
                <span>
                  <span className="font-medium">{r.profiles?.full_name ?? r.guest_name}</span>
                  <span className="ml-2 text-muted-foreground">{r.profiles?.email ?? r.guest_email}</span>
                  {!r.profiles ? <span className="ml-2 rounded bg-muted px-1.5 text-xs">invitado</span> : null}
                </span>
                <span className="text-muted-foreground">{formatShortDate(r.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
