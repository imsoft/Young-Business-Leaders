"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={cn(className, active && "text-foreground after:scale-x-100")}>
      {children}
    </Link>
  );
}
