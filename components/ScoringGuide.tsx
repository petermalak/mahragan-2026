"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  FESTIVAL,
  SATISFACTION_TIERS,
  SCORING_BONUS,
  TRADE_RULES,
} from "@/lib/festival";
import { SCORING_PHASES } from "@/lib/phases";

export function ScoringGuide() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="mb-10 space-y-6">
      <motion.div
        className="rounded-2xl border border-[var(--festival-gold)]/30 bg-black/25 p-6 text-center backdrop-blur-sm"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="mb-2 text-sm font-medium text-[var(--festival-gold)]">
          {FESTIVAL.tagline}
        </p>
        <h2 className="text-2xl font-bold text-[var(--festival-cream)] md:text-3xl">
          نظام التقييم والمنافسة
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/65">
          كل فريق يبني قريته، يجمع {FESTIVAL.currency}، ويمر بأربع مراحل —
          ومؤشر الرضا يعكس تقدم القرية والتداول بين الفرق.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SCORING_PHASES.map((phase, i) => (
          <motion.div
            key={phase.id}
            className="rounded-xl border border-white/10 bg-black/25 p-4 text-center"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <span className="text-3xl">{phase.icon}</span>
            <p className="mt-2 text-xs font-semibold text-[var(--festival-gold)]">
              {phase.title}
            </p>
            <p className="mt-1 text-sm text-white/75">{phase.goal}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/25 p-5">
          <h3 className="mb-2 font-bold text-[var(--festival-cream)]">
            {SCORING_BONUS.title}
          </h3>
          <ul className="space-y-1 text-sm text-white/70">
            {SCORING_BONUS.items.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/25 p-5">
          <h3 className="mb-2 font-bold text-[var(--festival-cream)]">
            {TRADE_RULES.title}
          </h3>
          <p className="text-sm text-white/70">{TRADE_RULES.summary}</p>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--festival-gold)]/20 bg-black/25 p-5">
        <h3 className="mb-4 text-center font-bold text-[var(--festival-cream)]">
          مؤشر الرضا
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SATISFACTION_TIERS.map((tier) => (
            <div
              key={tier.pct}
              className="rounded-lg bg-white/5 p-3 text-center"
            >
              <span className="text-2xl">{tier.emoji}</span>
              <p className="mt-1 text-lg font-bold text-[var(--festival-gold)]">
                {tier.pct}%
              </p>
              <p className="text-sm text-white/75">{tier.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
