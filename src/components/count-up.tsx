"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

export function CountUp({ value, from = 0, decimals = 0, suffix = "", delay = 0 }: {
  value: number;
  from?: number;
  decimals?: number;
  suffix?: string;
  delay?: number;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const visual = useRef<HTMLSpanElement>(null);
  const played = useRef(false);
  const inView = useInView(root, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const label = value.toFixed(decimals) + suffix;

  useEffect(() => {
    if (!inView || reduced !== false || played.current || !visual.current) return;
    played.current = true;
    const element = visual.current;
    element.textContent = from.toFixed(decimals) + suffix;
    const animation = animate(from, value, {
      duration: 1.4,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: latest => { element.textContent = (decimals ? latest.toFixed(decimals) : Math.round(latest).toString()) + suffix; },
      onComplete: () => { element.textContent = label; },
    });
    return () => { animation.stop(); element.textContent = label; };
  }, [inView, reduced, value, from, decimals, suffix, delay, label]);

  return <span className="count-up" ref={root}>
    <span className="sr-only">{label}</span>
    <span className="count-up-measure" aria-hidden="true">{label}</span>
    <span ref={visual} className="count-up-value" aria-hidden="true">{label}</span>
  </span>;
}
