"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FESTIVAL, PHASE_COLORS } from "@/lib/festival";
import { getPhaseProgressList, type TeamPhaseStats } from "@/lib/phases";

interface ScoringPhasesProps extends TeamPhaseStats {
  accent: string;
  primary: string;
}

export function ScoringPhases({
  houses,
  markets,
  landFixed,
  crops,
  tradeVolume,
  maxLandFixed,
  maxCrops,
  maxTradeVolume,
  accent,
  primary,
}: ScoringPhasesProps) {
  const reduceMotion = useReducedMotion();
  const phases = getPhaseProgressList({
    houses,
    markets,
    landFixed,
    crops,
    tradeVolume,
    maxLandFixed,
    maxCrops,
    maxTradeVolume,
  });

  return (
    <motion.section
      className="church-card overflow-hidden"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="border-b px-5 py-4"
        style={{ borderColor: "var(--festival-border)" }}
      >
        <h3 className="section-title text-lg">مراحل التقييم</h3>
        <p className="section-subtitle">تقدّم الفريق في بناء القرية</p>
      </div>

      <div className="divide-y" style={{ borderColor: "var(--festival-border)" }}>
        {phases.map((item, index) => {
          const phaseColor = PHASE_COLORS[index] ?? FESTIVAL.gold;
          return (
            <motion.div
              key={item.phase.id}
              className={`px-5 py-4 ${
                item.currentPhase ? "bg-[var(--festival-surface)]" : ""
              }`}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
                  style={{
                    background: `${phaseColor}18`,
                    color: phaseColor,
                  }}
                >
                  {item.complete ? "✓" : item.phase.icon}
                </span>
                <div className="flex-1">
                  <span className="font-semibold text-[var(--festival-ink)]">
                    {item.phase.title}
                  </span>
                  <p className="text-xs text-[var(--festival-ink-muted)]">
                    {item.phase.goal}
                  </p>
                </div>
                {item.currentPhase && !item.complete && (
                  <span
                    className="rounded-md px-2 py-0.5 text-xs font-medium"
                    style={{ color: phaseColor, background: `${phaseColor}14` }}
                  >
                    المرحلة الحالية
                  </span>
                )}
                {item.complete && (
                  <span className="rounded-md bg-[var(--festival-sage)]/15 px-2 py-0.5 text-xs text-[var(--festival-sage)]">
                    مكتملة
                  </span>
                )}
              </div>
              <p className="mb-2 text-xs text-[var(--festival-ink-muted)]">
                {item.detail}
              </p>
              <div className="progress-track h-1.5">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: item.complete ? FESTIVAL.sage : phaseColor,
                  }}
                  initial={
                    reduceMotion ? { width: `${item.progress}%` } : { width: 0 }
                  }
                  animate={{ width: `${item.progress}%` }}
                  transition={{ duration: 0.7, delay: index * 0.08 }}
                />
              </div>
              <p className="mt-1 text-left text-xs text-[var(--festival-ink-muted)]">
                {item.progress}%
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
