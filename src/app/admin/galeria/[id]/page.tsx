import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteAlbum } from "@/actions/admin";
import { AlbumForm } from "@/components/admin/album-form";
import { PhotoUploader } from "@/components/admin/photo-uploader";
import { PhotoGrid } from "@/components/admin/photo-grid";
import { DeleteButton } from "@/components/admin/delete-button";
import { FormMessage } from "@/components/forms/field";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Editar álbum" };

export default function EditarAlbumPage({ params, searchParams }: PageProps<"/admin/galeria/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
      <Body params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Body({ params, searchParams }: { params: PageProps<"/admin/galeria/[id]">["params"]; searchParams: PageProps<"/admin/galeria/[id]">["searchParams"] }) {
  await requireAdmin();
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const admin = createAdminClient();
  const { data: album } = await admin.from("gallery_albums").select("*").eq("id", id).maybeSingle();
  if (!album) notFound();
  const { data: photos } = await admin.from("gallery_photos").select("*").eq("album_id", id).order("sort_order").order("created_at");
  const remove = deleteAlbum.bind(null, album.id);
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-extrabold">{album.title}</h1>
        <DeleteButton onConfirm={remove} label="Eliminar álbum" />
      </div>
      {sp.saved ? <FormMessage ok message="Álbum guardado." /> : null}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="h-fit rounded-2xl border bg-card p-6">
          <AlbumForm album={album} />
        </div>
        <div className="grid gap-6">
          <div className="rounded-2xl border bg-card p-6">
            <PhotoUploader albumId={album.id} />
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="font-heading mb-3 text-lg font-bold">Fotos ({photos?.length ?? 0})</h2>
            <PhotoGrid photos={photos ?? []} albumId={album.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
