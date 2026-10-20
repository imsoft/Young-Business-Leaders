import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Perfiles de quienes construyeron yblmx.org. */
const PLATFORM_DEVELOPERS = new Set(["d5567511-2179-474e-8937-666402ae131b"]);

export const isPlatformDeveloper = (profileId: string) => PLATFORM_DEVELOPERS.has(profileId);

export function DeveloperBadge({ profileId, compact = false, className }: { profileId: string; compact?: boolean; className?: string }) {
  if (!isPlatformDeveloper(profileId)) return null;
  return (
    <span
      title="Desarrolló la plataforma de Young Business Leaders"
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full bg-ink font-bold text-white ring-1 ring-gold/60",
        compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className,
      )}
    >
      <Code2 className={cn("text-gold", compact ? "size-3" : "size-3.5")} aria-hidden="true" />
      {compact ? "Dev" : "Desarrollador de la plataforma"}
    </span>
  );
}
