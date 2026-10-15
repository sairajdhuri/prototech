"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";

export function Reveal({ children, className = "", delay = 0, variant = "rise" }: { children: ReactNode; className?: string; delay?: number; variant?: "rise" | "fade" | "image" | "side" }) {
  const reduce = useReducedMotion();
  const entrance = variant === "fade" ? { opacity: [0.72, 1] }
    : variant === "image" ? { opacity: [0.8, 1], scale: [0.97, 1] }
    : variant === "side" ? { opacity: [0.72, 1], x: [16, 0] }
    : { opacity: [0.72, 1], y: [24, 0] };
  return <motion.div className={className} initial={false} whileInView={reduce ? undefined : entrance} viewport={{ once: true, amount: 0.16 }} transition={{ duration: variant === "image" ? 0.9 : variant === "fade" ? 0.45 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
