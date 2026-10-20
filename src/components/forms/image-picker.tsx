"use client";

import { useEffect, useRef, useState } from "react";
import { ImageUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

/**
 * Selector de imagen con vista previa inmediata (sin subir nada) y validación de tipo y peso.
 * El <input type="file"> sigue dentro del formulario, así que el server action recibe el archivo igual.
 */
export function ImagePicker({
  id,
  name,
  current,
  fallback,
  shape = "rounded",
  maxMb = 3,
  error,
  hint,
}: {
  id: string;
  name: string;
  current?: string | null;
  fallback: React.ReactNode;
  shape?: "rounded" | "circle";
  maxMb?: number;
  error?: string;
  hint?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    setProblem(null);
    if (!file) return setPreview(null);
    if (!ACCEPT.includes(file.type)) {
      e.currentTarget.value = "";
      setPreview(null);
      return setProblem("Ese formato no se puede usar. Elige un JPG, PNG o WebP.");
    }
    if (file.size > maxMb * 1024 * 1024) {
      e.currentTarget.value = "";
      setPreview(null);
      return setProblem(`La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo es ${maxMb} MB.`);
    }
    setPreview(URL.createObjectURL(file));
  }

  function clear() {
    if (input.current) input.current.value = "";
    setPreview(null);
    setProblem(null);
  }

  const src = preview ?? current ?? null;
  const message = problem ?? error;
  return (
    <div className="flex items-center gap-4">
      <div
        className={cn(
          "relative grid size-20 shrink-0 place-items-center overflow-hidden bg-accent text-2xl font-extrabold text-gold-deep ring-1 ring-border",
          shape === "circle" ? "rounded-full" : "rounded-2xl",
          preview && "ring-2 ring-gold",
        )}
      >
        {src ? (
          // Vista previa local (blob:) o imagen ya guardada
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="size-full object-cover" />
        ) : (
          fallback
        )}
      </div>
      <div className="grid min-w-0 gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => input.current?.click()}>
            <ImageUp /> {src ? "Cambiar imagen" : "Elegir imagen"}
          </Button>
          {preview ? (
            <Button type="button" size="sm" variant="ghost" onClick={clear}>
              <X /> Descartar
            </Button>
          ) : null}
        </div>
        <input ref={input} id={id} name={name} type="file" accept={ACCEPT.join(",")} onChange={onChange} className="sr-only" />
        {message ? (
          <p className="text-xs text-destructive" role="alert">{message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">{preview ? "Así se verá. Se guarda al enviar el formulario." : hint}</p>
        )}
      </div>
    </div>
  );
}
