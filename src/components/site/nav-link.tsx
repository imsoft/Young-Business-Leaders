"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({ href, children, className, exact = false }: { href: string; children: React.ReactNode; className?: string; exact?: boolean }) {
  const pathname = usePathname();
  const active = pathname === href || (!exact && pathname.startsWith(`${href}/`));
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={cn(className, active && "text-foreground after:scale-x-100")}>
      {children}
    </Link>
  );
}
