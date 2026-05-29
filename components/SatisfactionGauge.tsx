"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/CountUp";
import { satisfactionLabel } from "@/lib/satisfaction";

interface SatisfactionGaugeProps {
  value: number;
  primary: string;
  accent: string;
}

export function SatisfactionGauge({
  value,
  primary,
  accent,
}: SatisfactionGaugeProps) {
  const reduceMotion = useReducedMotion();
  const label = satisfactionLabel(value);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (value / 100) * circumference;

  return (
    <motion.div
      className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-white/15 bg-black/25 p-6 backdrop-blur-md"
      initial={reduceMotion ? false : { opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.08 }}
      whileHover={reduceMotion ? {} : { scale: 1.02 }}
    >
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ boxShadow: `inset 0 0 30px ${accent}22` }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}
      <p className="mb-4 text-sm font-medium text-white/70">مؤشر رضا القرية</p>
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="10"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={accent}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={
              reduceMotion
                ? { strokeDashoffset: offset }
                : { strokeDashoffset: circumference }
            }
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        {!reduceMotion && value >= 70 && (
          <motion.div
            className="absolute inset-2 rounded-full"
            style={{ border: `2px solid ${accent}44` }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={value}
            className="text-3xl font-bold"
            style={{ color: accent }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <CountUp value={value} />%
          </motion.span>
          <motion.span
            className="mt-1 rounded-full px-3 py-0.5 text-xs font-semibold"
            style={{ background: `${primary}55`, color: accent }}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {label}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
