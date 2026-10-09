"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const line: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};

export function HeroIntro({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} variants={container} initial={reduce ? "show" : "hidden"} animate="show">
      {children}
    </motion.div>
  );
}

export function HeroLine({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={line}>
      {children}
    </motion.div>
  );
}

/** Logo que entra con escala y luego flota lentamente. */
export function FloatingMark({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Blobs de luz que se mueven despacio detrás del hero. */
export function HeroGlow() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 size-[28rem] rounded-full bg-white/25 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-32 size-[32rem] rounded-full bg-[oklch(0.6_0.17_55)]/40 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}
