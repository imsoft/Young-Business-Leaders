import { cn } from "@/lib/utils";

/** Fondo dorado con la marca en marca de agua, para tarjetas sin imagen. */
export function BrandPlaceholder({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-gold-gradient", className)} aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
      <svg viewBox="0 0 80 120" className="absolute -right-4 -bottom-6 h-[85%] w-auto opacity-25" fill="white">
        <path d="M0 0H80V40.04L60.06 59.99L80 79.93V120H0V97.07L10 87.07V110H70V84.07L50.93 65H28.33L23.37 60.04L28.41 55H50.9L70 35.9V10H10V32.8L0 22.8Z" />
        <circle cx="40" cy="31" r="10" />
      </svg>
    </div>
  );
}
