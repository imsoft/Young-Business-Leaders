import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { AlbumForm } from "@/components/admin/album-form";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Galería" };

export default function AdminGaleriaPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="grid gap-6">
        <h1 className="font-heading text-2xl font-extrabold">Álbumes</h1>
        <Suspense fallback={<Skeleton className="h-64 rounded-2xl" />}>
          <Body />
        </Suspense>
      </div>
      <aside className="h-fit rounded-2xl border bg-card p-6">
        <h2 className="font-heading mb-4 text-lg font-bold">Nuevo álbum</h2>
        <AlbumForm />
      </aside>
    </div>
  );
}

async function Body() {
  await requireAdmin();
  const { data } = await createAdminClient().from("gallery_albums").select("*").order("sort_order").order("event_date", { ascending: false });
  const albums = data ?? [];
  if (albums.length === 0) return <p className="text-muted-foreground">Crea el primer álbum con el formulario.</p>;
  return (
    <ul className="grid gap-3">
      {albums.map((a) => (
        <li key={a.id} className="flex items-center justify-between gap-3 rounded-2xl border bg-card p-4">
          <div>
            <Link href={`/admin/galeria/${a.id}`} className="font-medium hover:underline">{a.title}</Link>
            <p className="text-xs text-muted-foreground">/galeria/{a.slug}</p>
          </div>
          <Badge variant={a.published ? "default" : "secondary"}>{a.published ? "Publicado" : "Borrador"}</Badge>
        </li>
      ))}
    </ul>
  );
}
