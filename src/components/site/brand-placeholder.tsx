import { cn } from "@/lib/utils";

/** Fondo dorado con la marca en marca de agua, para tarjetas sin imagen. */
export function BrandPlaceholder({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-gold-gradient", className)} aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
      <svg
        viewBox="0 0 64 64"
        className="absolute -right-6 -bottom-8 h-[80%] w-auto opacity-25"
        fill="none"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 12h26a9 9 0 0 1 0 18H26" />
        <path d="M26 30h16a11 11 0 0 1 0 22H16" />
      </svg>
    </div>
  );
}
