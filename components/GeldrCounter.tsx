"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/CountUp";
import { FESTIVAL } from "@/lib/festival";

interface GeldrCounterProps {
  value: number;
  primary: string;
  accent: string;
}

export function GeldrCounter({ value, primary, accent }: GeldrCounterProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="church-card-elevated p-6"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="mb-1 text-sm text-[var(--festival-ink-muted)]">
        رصيد {FESTIVAL.currency}
      </p>
      <motion.p
        key={value}
        className="text-4xl font-bold tabular-nums md:text-5xl"
        style={{ color: accent }}
        initial={reduceMotion ? false : { opacity: 0.8 }}
        animate={{ opacity: 1 }}
      >
        <CountUp value={value} />
      </motion.p>
      <div
        className="mt-3 h-0.5 w-12 rounded-full opacity-60"
        style={{ background: primary }}
      />
    </motion.div>
  );
}
