"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/CountUp";
import { SATISFACTION_TIERS } from "@/lib/festival";
import { satisfactionLabel, satisfactionTier } from "@/lib/satisfaction";

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
  const tier = satisfactionTier(value);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (value / 100) * circumference;

  return (
    <motion.div
      className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-[var(--festival-gold)]/25 bg-black/30 p-6 backdrop-blur-md"
      initial={reduceMotion ? false : { opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.08 }}
    >
      <p className="mb-1 text-sm font-medium text-white/70">مؤشر رضا القرية</p>
      <p className="mb-4 text-xs text-[var(--festival-gold)]">
        حسب العرض: 25% · 50% · 75% · 100%
      </p>
      <div className="relative h-40 w-40">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="10"
          />
          {[25, 50, 75, 100].map((mark) => {
            const angle = (mark / 100) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const x1 = 60 + 48 * Math.cos(rad);
            const y1 = 60 + 48 * Math.sin(rad);
            const x2 = 60 + 54 * Math.cos(rad);
            const y2 = 60 + 54 * Math.sin(rad);
            return (
              <line
                key={mark}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(212,175,55,0.45)"
                strokeWidth="2"
              />
            );
          })}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl">{tier.emoji}</span>
          <motion.span
            key={value}
            className="text-2xl font-bold"
            style={{ color: accent }}
          >
            <CountUp value={value} />%
          </motion.span>
          <motion.span
            className="mt-1 rounded-full px-3 py-0.5 text-xs font-semibold"
            style={{ background: `${primary}66`, color: accent }}
          >
            {label}
          </motion.span>
        </div>
      </div>
      <div className="mt-4 grid w-full grid-cols-4 gap-1 text-center text-[10px] text-white/50">
        {SATISFACTION_TIERS.slice()
          .reverse()
          .map((t) => (
            <span
              key={t.pct}
              className={
                value >= t.min ? "font-semibold text-[var(--festival-gold)]" : ""
              }
            >
              {t.pct}%
            </span>
          ))}
      </div>
    </motion.div>
  );
}
