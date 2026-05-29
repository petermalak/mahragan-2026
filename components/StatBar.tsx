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
      className="church-card p-4"
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? {} : { scale: 1.01 }}
    >
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-[var(--festival-ink)]">
          <span>{icon}</span>
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
      <div className="progress-track relative h-2">
        <motion.div
          className="absolute inset-y-0 right-0 h-full rounded-full"
          style={{ background: accent }}
          initial={reduceMotion ? { width: `${pct}%` } : { width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}
