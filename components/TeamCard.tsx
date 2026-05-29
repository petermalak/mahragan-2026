"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/CountUp";
import { getCompletedPhaseCount, getCurrentPhaseNumber } from "@/lib/phases";
import { satisfactionLabel } from "@/lib/satisfaction";
import { getTeamTheme } from "@/lib/teams";
import type { TeamWithMax } from "@/lib/types";

interface TeamCardProps {
  team: TeamWithMax;
  index?: number;
  rank?: number;
}

export function TeamCard({ team, index = 0, rank }: TeamCardProps) {
  const reduceMotion = useReducedMotion();
  const theme = getTeamTheme(team.slug);
  const label = satisfactionLabel(team.satisfaction);
  const phaseStats = {
    houses: team.houses,
    markets: team.markets,
    landFixed: team.landFixed,
    crops: team.crops,
    tradeVolume: team.tradeVolume,
    maxLandFixed: team.maxLandFixed,
    maxCrops: team.maxCrops,
    maxTradeVolume: team.maxTradeVolume,
  };
  const currentPhase = getCurrentPhaseNumber(phaseStats);
  const completedPhases = getCompletedPhaseCount(phaseStats);
  const phasePct = Math.round((completedPhases / 4) * 100);

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={reduceMotion ? {} : { y: -4 }}
      className="church-card group overflow-hidden transition-shadow hover:shadow-md"
      style={{
        borderTopColor: theme.primary,
        borderTopWidth: 3,
      }}
    >
      <div
        className="p-5"
        style={{
          background: `linear-gradient(180deg, ${theme.gradientFrom} 0%, ${theme.gradientTo} 100%)`,
        }}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
              style={{
                background: `${theme.primary}18`,
                border: `1px solid ${theme.secondary}33`,
              }}
            >
              {theme.emoji}
            </span>
            <div>
              <h2 className="font-bold text-[var(--festival-ink)]">
                {team.nameAr}
              </h2>
              <p className="text-xs text-[var(--festival-ink-muted)]">
                المرحلة {currentPhase} من 4
                {rank ? ` · الترتيب ${rank}` : ""}
              </p>
            </div>
          </div>
          <span
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium"
            style={{
              background: `${theme.primary}14`,
              color: theme.accent,
            }}
          >
            {label}
          </span>
        </div>

        <div className="mb-4">
          <div className="mb-1.5 flex justify-between text-xs text-[var(--festival-ink-muted)]">
            <span>تقدّم المراحل</span>
            <span>{completedPhases}/4</span>
          </div>
          <div className="progress-track h-1.5">
            <motion.div
              className="h-full rounded-full"
              style={{ background: theme.secondary }}
              initial={reduceMotion ? { width: `${phasePct}%` } : { width: 0 }}
              animate={{ width: `${phasePct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="stat-box px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-[var(--festival-ink-muted)]">
              جلدر
            </p>
            <p className="text-lg font-bold text-gold">
              <CountUp value={team.geldr} />
            </p>
          </div>
          <div className="stat-box px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-[var(--festival-ink-muted)]">
              الرضا
            </p>
            <p className="text-lg font-bold" style={{ color: theme.accent }}>
              <CountUp value={team.satisfaction} />%
            </p>
          </div>
        </div>

        <Link
          href={`/teams/${team.slug}`}
          className="block w-full rounded-lg py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: theme.primary }}
        >
          عرض تفاصيل الفريق
        </Link>
      </div>
    </motion.article>
  );
}
