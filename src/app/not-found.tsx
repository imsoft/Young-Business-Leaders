import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
      <Logo />
      <h1 className="font-heading text-4xl font-extrabold">Página no encontrada</h1>
      <p className="max-w-md text-muted-foreground">Puede que el evento o la página se hayan movido.</p>
      <Link href="/" className={cn(buttonVariants(), "font-semibold")}>Ir al inicio</Link>
    </div>
  );
}
