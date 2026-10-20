import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Logo oficial horizontal (símbolo + "YOUNG BUSINESS LEADERS / BY CCJEJ"). `dark` = versión con texto blanco. */
export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex shrink-0 items-center", className)} aria-label="Young Business Leaders by CCJEJ, inicio">
      <Image
        src={dark ? "/brand/ybl-logo-horizontal-white.svg" : "/brand/ybl-logo-horizontal.svg"}
        alt="Young Business Leaders by CCJEJ"
        width={297}
        height={40}
        unoptimized
        preload={!dark}
        className="h-7 w-auto sm:h-8"
      />
    </Link>
  );
}
