"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
      <Logo />
      <h1 className="font-heading text-3xl font-extrabold">Algo salió mal</h1>
      <p className="max-w-md text-muted-foreground">Ya quedó registrado. Intenta de nuevo o vuelve al inicio.</p>
      <div className="flex gap-3">
        <Button onClick={reset} className="font-semibold">Reintentar</Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>Ir al inicio</Link>
      </div>
    </div>
  );
}
