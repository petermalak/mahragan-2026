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
      className="relative overflow-hidden rounded-2xl border border-[var(--festival-gold)]/25 bg-black/30 p-6 backdrop-blur-md"
      initial={reduceMotion ? false : { opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
    >
      <div
        className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full opacity-25 blur-2xl"
        style={{ background: primary }}
      />
      <p className="mb-1 text-sm font-medium text-white/70">
        رصيد {FESTIVAL.currency}
      </p>
      <p className="mb-3 text-xs text-[var(--festival-gold)]">
        العملة الرسمية للمنافسة
      </p>
      <motion.p
        key={value}
        className="flex items-center gap-2 text-4xl font-bold tracking-tight md:text-5xl"
        style={{ color: accent }}
        initial={reduceMotion ? false : { scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        <CountUp value={value} />
        <span className="text-2xl text-[var(--festival-gold)] md:text-3xl">
          🪙
        </span>
      </motion.p>
    </motion.div>
  );
}
