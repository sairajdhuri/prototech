"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Arrow } from "./icons";

const MotionLink = motion.create(Link);

export function ButtonLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return <MotionLink href={href} className={`button${light ? " button-light" : ""}`} whileTap={{ scale: 0.97 }} transition={{ duration: 0.14 }}><span>{children}</span><Arrow /></MotionLink>;
}
