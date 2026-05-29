"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/CountUp";

interface GeldrCounterProps {
  value: number;
  primary: string;
  accent: string;
}

export function GeldrCounter({ value, primary, accent }: GeldrCounterProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/25 p-6 backdrop-blur-md"
      initial={reduceMotion ? false : { opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      whileHover={reduceMotion ? {} : { scale: 1.02 }}
    >
      <motion.div
        className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl"
        style={{ background: primary }}
        animate={reduceMotion ? {} : { scale: [1, 1.25, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}18, transparent)`,
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3 }}
        />
      )}
      <p className="mb-1 text-sm font-medium text-white/70">رصيد الجلدر</p>
      <motion.p
        key={value}
        className="flex items-center gap-2 text-4xl font-bold tracking-tight md:text-5xl"
        style={{ color: accent }}
        initial={reduceMotion ? false : { scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        <CountUp value={value} />
        <motion.span
          className="text-2xl md:text-3xl"
          animate={reduceMotion ? {} : { rotateY: [0, 360] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "inline-block" }}
        >
          🪙
        </motion.span>
      </motion.p>
    </motion.div>
  );
}
