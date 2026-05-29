"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ScriptureTagline } from "@/components/ScriptureTagline";
import {
  FESTIVAL,
  PHASE_COLORS,
  SATISFACTION_TIERS,
  SCORING_BONUS,
  TRADE_RULES,
} from "@/lib/festival";
import { SCORING_PHASES } from "@/lib/phases";

function ScoringGuideContent({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className={compact ? "space-y-5" : "mb-10 space-y-6"}>
      {!compact && (
        <div className="church-card-elevated p-6 text-center">
          <ScriptureTagline className="mb-2 text-sm" />
          <h2 className="section-title text-2xl">نظام التقييم والمنافسة</h2>
          <p className="section-subtitle mx-auto mt-3 max-w-xl">
            كل فريق يبني قريته، يجمع {FESTIVAL.currency}، ويمر بأربع مراحل —
            ومؤشر الرضا يعكس تقدم القرية والتداول بين الفرق.
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SCORING_PHASES.map((phase, i) => (
          <div
            key={phase.id}
            className="church-card p-4 text-center"
            style={{ borderTopColor: PHASE_COLORS[i], borderTopWidth: 2 }}
          >
            <span className="text-2xl">{phase.icon}</span>
            <p
              className="mt-2 text-xs font-semibold"
              style={{ color: PHASE_COLORS[i] }}
            >
              {phase.title}
            </p>
            <p className="mt-1 text-sm text-[var(--festival-ink-muted)]">{phase.goal}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="church-card p-5">
          <h3 className="section-title mb-2 text-base">
            {SCORING_BONUS.title}
          </h3>
          <ul className="space-y-1.5 text-sm text-[var(--festival-ink-muted)]">
            {SCORING_BONUS.items.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="church-card p-5">
          <h3 className="section-title mb-2 text-base">{TRADE_RULES.title}</h3>
          <p className="text-sm text-[var(--festival-ink-muted)]">{TRADE_RULES.summary}</p>
        </div>
      </div>

      <div className="church-card p-5">
        <h3 className="section-title mb-4 text-center text-base">
          مؤشر الرضا
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SATISFACTION_TIERS.map((tier) => (
            <div
              key={tier.pct}
              className="rounded-lg p-3 text-center"
              style={{
                background: `${tier.color}14`,
                border: `1px solid ${tier.color}33`,
              }}
            >
              <p className="text-lg font-bold" style={{ color: tier.color }}>
                {tier.pct}%
              </p>
              <p className="text-sm text-[var(--festival-ink-muted)]">{tier.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ScoringGuide({ compact = false }: { compact?: boolean }) {
  return <ScoringGuideContent compact={compact} />;
}

export function CollapsibleScoringGuide() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <section className="mt-4 border-t pt-8" style={{ borderColor: "var(--festival-border)" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="church-card flex w-full items-center justify-between px-5 py-4 text-right transition-colors hover:bg-[var(--festival-surface)]"
      >
        <span className="section-title text-base">دليل نظام النقاط</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="text-gold opacity-70"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-6">
              <ScoringGuideContent compact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
