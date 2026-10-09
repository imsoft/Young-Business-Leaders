import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label="Young Business Leaders MX">
      <span className="grid size-9 place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
        <svg viewBox="0 0 64 64" className="size-6" aria-hidden="true" fill="none" stroke="#E9A23B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 12h26a9 9 0 0 1 0 18H26" />
          <path d="M26 30h16a11 11 0 0 1 0 22H16" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-heading text-[13px] font-extrabold tracking-wide", dark ? "text-white" : "text-ink")}>
          <span className="text-gold">YOUNG</span> BUSINESS LEADERS
        </span>
        <span className={cn("text-[9px] font-semibold tracking-[0.2em] uppercase", dark ? "text-white/60" : "text-muted-foreground")}>
          by CCJEJ
        </span>
      </span>
    </Link>
  );
}
