"use client";

import { motion, useReducedMotion } from "framer-motion";
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
      className="rounded-2xl border border-[var(--festival-gold)]/25 bg-black/30 p-5 backdrop-blur-md md:p-6"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="mb-6 text-center">
        <h3 className="text-lg font-bold text-[var(--festival-cream)]">
          مراحل التقييم والمنافسة
        </h3>
        <p className="mt-1 text-sm text-white/55">
          تقدم الفريق في بناء القرية حسب نظام المهرجان
        </p>
      </div>

      <div className="relative space-y-4">
        <div
          className="absolute right-[1.65rem] top-4 hidden h-[calc(100%-2rem)] w-0.5 sm:block"
          style={{ background: `${accent}33` }}
        />
        {phases.map((item, index) => (
          <motion.div
            key={item.phase.id}
            className={`relative flex gap-4 rounded-xl border p-4 transition-colors ${
              item.currentPhase
                ? "border-[var(--festival-gold)]/50 bg-[var(--festival-gold)]/10"
                : item.complete
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-white/10 bg-black/20"
            }`}
            initial={reduceMotion ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg ${
                item.complete
                  ? "bg-emerald-600/80"
                  : item.currentPhase
                    ? "ring-2 ring-[var(--festival-gold)]"
                    : "bg-white/10"
              }`}
              style={
                item.currentPhase && !item.complete
                  ? { background: `${primary}99` }
                  : undefined
              }
            >
              {item.complete ? "✓" : item.phase.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="font-bold text-[var(--festival-cream)]">
                  {item.phase.title}
                </span>
                {item.currentPhase && !item.complete && (
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={{ background: `${accent}44`, color: accent }}
                  >
                    المرحلة الحالية
                  </span>
                )}
                {item.complete && (
                  <span className="rounded-full bg-emerald-500/25 px-2 py-0.5 text-xs font-semibold text-emerald-200">
                    مكتملة
                  </span>
                )}
              </div>
              <p className="mb-2 text-sm text-white/70">{item.phase.goal}</p>
              <p className="mb-2 text-xs text-white/50">{item.detail}</p>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: item.complete
                      ? "#34d399"
                      : `linear-gradient(to left, ${accent}, ${primary})`,
                  }}
                  initial={reduceMotion ? { width: `${item.progress}%` } : { width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ duration: 0.9, delay: index * 0.1 }}
                />
              </div>
              <p className="mt-1 text-left text-xs text-white/45">
                {item.progress}%
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
