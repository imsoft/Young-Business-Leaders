import Link from "next/link";
import { cn } from "@/lib/utils";

/** Aviso de privacidad simplificado para mostrar donde se piden datos. */
export function PrivacyNote({ purpose, className }: { purpose: string; className?: string }) {
  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      Usamos tus datos solo para {purpose}. Consulta el{" "}
      <Link href="/aviso-de-privacidad" className="underline hover:text-foreground">aviso de privacidad</Link>.
    </p>
  );
}
