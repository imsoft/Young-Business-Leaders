"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

/** Borrado en dos clics, sin diálogo nativo. */
export function DeleteButton({ onConfirm, label = "Eliminar" }: { onConfirm: () => Promise<unknown>; label?: string }) {
  const [armed, setArmed] = useState(false);
  const [pending, start] = useTransition();
  if (!armed) {
    return <Button type="button" variant="ghost" size="sm" onClick={() => setArmed(true)}>{label}</Button>;
  }
  return (
    <span className="inline-flex items-center gap-1">
      <Button type="button" variant="destructive" size="sm" disabled={pending} onClick={() => start(async () => { await onConfirm(); })}>
        {pending ? "Eliminando…" : "Confirmar"}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setArmed(false)}>Cancelar</Button>
    </span>
  );
}
