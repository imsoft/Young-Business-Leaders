import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatShortDate, formatEventTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Eventos" };

export default function AdminEventosPage() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-extrabold">Eventos</h1>
        <Link href="/admin/eventos/nuevo" className={cn(buttonVariants(), "font-semibold")}><Plus /> Nuevo evento</Link>
      </div>
      <Suspense fallback={<Skeleton className="h-64 rounded-2xl" />}>
        <Body />
      </Suspense>
    </div>
  );
}

async function Body() {
  await requireAdmin();
  const admin = createAdminClient();
  const { data } = await admin.from("events").select("*").order("starts_at", { ascending: false }).limit(200);
  const events = data ?? [];
  const counts = await Promise.all(events.map((e) => admin.rpc("event_attendee_count", { event: e.id }).then((r) => r.data ?? 0)));
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="hidden md:table-cell">Registros</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">Crea tu primer evento.</TableCell></TableRow>
          ) : events.map((e, i) => (
            <TableRow key={e.id}>
              <TableCell>
                <Link href={`/admin/eventos/${e.id}`} className="font-medium hover:underline">{e.title}</Link>
                <p className="text-xs text-muted-foreground">/eventos/{e.slug}</p>
              </TableCell>
              <TableCell className="whitespace-nowrap">{formatShortDate(e.starts_at)} · {formatEventTime(e.starts_at)}</TableCell>
              <TableCell className="hidden md:table-cell">{counts[i]}{e.capacity ? ` / ${e.capacity}` : ""}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  <Badge variant={e.published ? "default" : "secondary"}>{e.published ? "Publicado" : "Borrador"}</Badge>
                  {!e.is_public ? <Badge variant="outline">Miembros</Badge> : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
