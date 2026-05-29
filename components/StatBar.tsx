"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/CountUp";

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  icon: string;
  accent: string;
  delay?: number;
}

export function StatBar({
  label,
  value,
  max,
  icon,
  accent,
  delay = 0,
}: StatBarProps) {
  const reduceMotion = useReducedMotion();
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <motion.div
      className="rounded-xl border border-white/10 bg-black/20 p-4"
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? {} : { scale: 1.02, borderColor: `${accent}55` }}
    >
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-white/80">
          <motion.span
            animate={reduceMotion ? {} : { rotate: [0, -12, 12, 0], scale: [1, 1.15, 1] }}
            transition={{
              duration: 0.6,
              delay: delay + 0.4,
              ease: "easeOut",
            }}
          >
            {icon}
          </motion.span>
          {label}
        </span>
        <motion.span
          className="font-bold"
          style={{ color: accent }}
          key={value}
          initial={reduceMotion ? false : { opacity: 0.5, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CountUp value={value} />
        </motion.span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="absolute inset-y-0 right-0 rounded-full"
          style={{ background: accent }}
          initial={reduceMotion ? { width: `${pct}%` } : { width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
        {!reduceMotion && pct > 0 && (
          <motion.div
            className="absolute inset-y-0 w-8 rounded-full bg-white/40 blur-sm"
            initial={{ right: "100%" }}
            whileInView={{ right: `${100 - pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: delay + 0.15 }}
          />
        )}
      </div>
    </motion.div>
  );
}
