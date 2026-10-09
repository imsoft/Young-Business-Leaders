import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-6xl px-4 py-16 md:py-24", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-bold tracking-[0.2em] text-gold-deep uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="font-heading text-3xl font-extrabold tracking-tight text-balance md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-base text-muted-foreground md:text-lg">{description}</p> : null}
    </Reveal>
  );
}
