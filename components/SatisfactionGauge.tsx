"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/CountUp";
import { SATISFACTION_TIERS } from "@/lib/festival";
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
      className="church-card-elevated flex flex-col items-center p-6"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="mb-1 text-sm text-[var(--festival-ink-muted)]">
        مؤشر رضا القرية
      </p>
      <p className="mb-4 text-xs text-gold">25% · 50% · 75% · 100%</p>
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="var(--festival-surface)"
            strokeWidth="8"
          />
          {[25, 50, 75, 100].map((mark) => {
            const angle = (mark / 100) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={mark}
                x1={60 + 48 * Math.cos(rad)}
                y1={60 + 48 * Math.sin(rad)}
                x2={60 + 54 * Math.cos(rad)}
                y2={60 + 54 * Math.sin(rad)}
                stroke="rgba(166,139,75,0.45)"
                strokeWidth="1.5"
              />
            );
          })}
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={accent}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={
              reduceMotion
                ? { strokeDashoffset: offset }
                : { strokeDashoffset: circumference }
            }
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: accent }}>
            <CountUp value={value} />%
          </span>
          <span
            className="mt-1 rounded-md px-2 py-0.5 text-xs font-medium"
            style={{ background: `${primary}18`, color: accent }}
          >
            {label}
          </span>
        </div>
      </div>
      <div className="mt-4 grid w-full grid-cols-4 gap-1 text-center text-[10px] text-[var(--festival-ink-muted)]">
        {SATISFACTION_TIERS.slice()
          .reverse()
          .map((t) => (
            <span
              key={t.pct}
              className={value >= t.min ? "font-semibold text-gold" : ""}
            >
              {t.pct}%
            </span>
          ))}
      </div>
    </motion.div>
  );
}
