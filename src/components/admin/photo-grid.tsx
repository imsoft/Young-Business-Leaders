"use client";

import Image from "next/image";
import { useTransition } from "react";
import { X } from "lucide-react";
import { deletePhoto } from "@/actions/admin";
import type { GalleryPhoto } from "@/lib/types";

export function PhotoGrid({ photos, albumId }: { photos: GalleryPhoto[]; albumId: string }) {
  const [pending, start] = useTransition();
  if (photos.length === 0) return <p className="text-sm text-muted-foreground">Sin fotos todavía.</p>;
  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5" data-pending={pending || undefined}>
      {photos.map((p) => (
        <li key={p.id} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Image src={p.url} alt="" fill sizes="20vw" className="object-cover" />
          <button
            type="button"
            aria-label="Eliminar foto"
            disabled={pending}
            onClick={() => start(() => deletePhoto(p.id, albumId))}
            className="absolute top-1 right-1 grid size-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
          >
            <X className="size-3.5" />
          </button>
        </li>
      ))}
    </ul>
  );
}
