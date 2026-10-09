"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Abrir menú" />}>
        <Menu />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Menú</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {links.map((l) => (
            <SheetClose key={l.href} nativeButton={false} render={<Link href={l.href} />} className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-muted">
              {l.label}
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
