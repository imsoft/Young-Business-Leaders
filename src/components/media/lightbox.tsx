"use client";

import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { createContext, use, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type LightboxItem = { src: string; width: number; height: number; alt: string; caption?: string };

const LightboxContext = createContext<(index: number) => void>(() => {});

/** Envuelve una cuadrícula de miniaturas; cada <LightboxTrigger index> abre la imagen en grande. */
export function Lightbox({ items, children }: { items: LightboxItem[]; children: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const count = items.length;
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + count) % count));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, count]);

  const step = (d: number) => setIndex((i) => (i === null ? i : (i + d + count) % count));
  const item = index !== null ? items[index] : null;

  return (
    <LightboxContext value={setIndex}>
      {children}
      <Dialog.Root open={open} onOpenChange={(o) => !o && setIndex(null)}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/92 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
          <Dialog.Popup
            className="fixed inset-0 z-50 flex flex-col text-white outline-none transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            }}
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <Dialog.Title className="min-w-0 truncate text-sm font-medium text-white/80">
                {item?.caption ?? item?.alt ?? "Imagen"}
              </Dialog.Title>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs tabular-nums text-white/60">
                  {(index ?? 0) + 1} / {count}
                </span>
                <Dialog.Close aria-label="Cerrar" className="grid size-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20">
                  <X className="size-5" />
                </Dialog.Close>
              </div>
            </div>
            <div className="relative min-h-0 flex-1">
              {item ? (
                <Image key={item.src} src={item.src} alt={item.alt} fill sizes="100vw" loading="eager" className="object-contain p-2 sm:p-6" />
              ) : null}
              {count > 1 ? (
                <>
                  <NavButton side="left" onClick={() => step(-1)} />
                  <NavButton side="right" onClick={() => step(1)} />
                </>
              ) : null}
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </LightboxContext>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Anterior" : "Siguiente"}
      className={cn(
        "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 transition hover:bg-gold hover:text-ink",
        side === "left" ? "left-3" : "right-3",
      )}
    >
      <Icon className="size-6" />
    </button>
  );
}

export function LightboxTrigger({
  index,
  label,
  className,
  children,
}: {
  index: number;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const open = use(LightboxContext);
  return (
    <button type="button" onClick={() => open(index)} aria-label={`Ver en grande: ${label}`} className={cn("block w-full cursor-zoom-in text-left", className)}>
      {children}
    </button>
  );
}
