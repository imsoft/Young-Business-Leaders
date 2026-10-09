import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Admin" };

export default function AdminHome() {
  return (
    <div className="grid gap-6">
      <h1 className="font-heading text-2xl font-extrabold">Resumen</h1>
      <Suspense fallback={<Skeleton className="h-32 rounded-2xl" />}>
        <Stats />
      </Suspense>
    </div>
  );
}

async function Stats() {
  await requireAdmin();
  const admin = createAdminClient();
  const [pending, approved, upcoming, messages] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("status", "approved"),
    admin.from("events").select("id", { count: "exact", head: true }).gte("starts_at", new Date().toISOString()),
    admin.from("contact_messages").select("id", { count: "exact", head: true }),
  ]);
  const cards = [
    { label: "Solicitudes pendientes", value: pending.count ?? 0, href: "/admin/miembros?estado=pending", hot: (pending.count ?? 0) > 0 },
    { label: "Miembros aprobados", value: approved.count ?? 0, href: "/admin/miembros" },
    { label: "Eventos próximos", value: upcoming.count ?? 0, href: "/admin/eventos" },
    { label: "Mensajes de contacto", value: messages.count ?? 0, href: "/admin/mensajes" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Link key={c.label} href={c.href} className={`rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md ${c.hot ? "border-gold" : ""}`}>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{c.label}</p>
          <p className="font-heading mt-2 text-3xl font-extrabold">{c.value}</p>
        </Link>
      ))}
    </div>
  );
}
