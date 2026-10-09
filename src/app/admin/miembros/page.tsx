import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { MemberActions } from "@/components/admin/member-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatShortDate, initials } from "@/lib/format";
import type { MemberStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Miembros" };

const STATUS_LABEL: Record<MemberStatus, string> = { pending: "Pendiente", approved: "Aprobado", rejected: "Rechazado" };
const FILTERS: { key: string; label: string }[] = [
  { key: "pending", label: "Pendientes" },
  { key: "approved", label: "Aprobados" },
  { key: "rejected", label: "Rechazados" },
  { key: "", label: "Todos" },
];

export default function MiembrosPage({ searchParams }: PageProps<"/admin/miembros">) {
  return (
    <div className="grid gap-6">
      <h1 className="font-heading text-2xl font-extrabold">Miembros</h1>
      <Suspense fallback={<Skeleton className="h-64 rounded-2xl" />}>
        <Body searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Body({ searchParams }: { searchParams: PageProps<"/admin/miembros">["searchParams"] }) {
  const [me, sp] = await Promise.all([requireAdmin(), searchParams]);
  const estado = typeof sp.estado === "string" ? sp.estado : "pending";
  const admin = createAdminClient();
  let query = admin.from("profiles").select("*").order("created_at", { ascending: false }).limit(300);
  if (estado === "pending" || estado === "approved" || estado === "rejected") query = query.eq("status", estado);
  const { data } = await query;
  const members = data ?? [];
  return (
    <>
      <div className="flex gap-1">
        {FILTERS.map((f) => (
          <Link key={f.key} href={f.key ? `/admin/miembros?estado=${f.key}` : "/admin/miembros?estado=all"} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", estado === (f.key || "all") ? "bg-ink text-white" : "hover:bg-accent")}>
            {f.label}
          </Link>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Miembro</TableHead>
              <TableHead className="hidden md:table-cell">Proyecto</TableHead>
              <TableHead className="hidden md:table-cell">Alta</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">Nada por aquí.</TableCell></TableRow>
            ) : members.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={m.avatar_url ?? undefined} alt="" />
                      <AvatarFallback>{initials(m.full_name || m.email)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{m.full_name || "(sin nombre)"} {m.is_admin ? <Badge variant="outline" className="ml-1">admin</Badge> : null}</p>
                      <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden max-w-[260px] md:table-cell">
                  <p className="truncate">{m.company ?? "—"}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.headline ?? m.industry ?? ""}</p>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{formatShortDate(m.created_at)}</TableCell>
                <TableCell>
                  <Badge variant={m.status === "approved" ? "default" : m.status === "rejected" ? "destructive" : "secondary"}>{STATUS_LABEL[m.status]}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <MemberActions id={m.id} status={m.status} isAdmin={m.is_admin} isSelf={m.id === me.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
