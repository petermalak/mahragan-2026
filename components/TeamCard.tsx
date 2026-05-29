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
}

export function TeamCard({ team, index = 0 }: TeamCardProps) {
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

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={reduceMotion ? {} : { y: -6, scale: 1.01 }}
      className="group relative overflow-hidden rounded-2xl border border-[var(--festival-gold)]/30 shadow-lg"
      style={{
        background: `linear-gradient(145deg, ${theme.gradientFrom} 0%, ${theme.gradientTo} 100%)`,
      }}
    >
      <div className="relative p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <span className="text-3xl">{theme.emoji}</span>
            <h2 className="mt-2 text-xl font-bold text-[var(--festival-cream)]">
              {team.nameAr}
            </h2>
            <p className="mt-1 text-xs text-white/55">
              المرحلة {currentPhase}/4 · {completedPhases} مكتملة
            </p>
          </div>
          <span
            className="rounded-full border border-[var(--festival-gold)]/30 px-3 py-1 text-xs font-semibold"
            style={{ background: `${theme.primary}44`, color: theme.accent }}
          >
            {label}
          </span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-white/10 bg-black/25 p-3">
            <p className="text-white/55">جلدر</p>
            <p
              className="text-lg font-bold"
              style={{ color: theme.accent }}
            >
              <CountUp value={team.geldr} /> 🪙
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/25 p-3">
            <p className="text-white/55">الرضا</p>
            <p
              className="text-lg font-bold"
              style={{ color: theme.accent }}
            >
              <CountUp value={team.satisfaction} />%
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2 text-xs text-white/75">
          <span className="rounded-md bg-black/25 px-2 py-1">🏠 {team.houses}</span>
          <span className="rounded-md bg-black/25 px-2 py-1">🛒 {team.markets}</span>
          <span className="rounded-md bg-black/25 px-2 py-1">🌱 {team.crops}</span>
        </div>

        <Link
          href={`/teams/${team.slug}`}
          className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--festival-gold)]/40 py-2.5 text-sm font-semibold text-[var(--festival-cream)] transition hover:bg-[var(--festival-gold)]/15"
          style={{ background: `${theme.primary}cc` }}
        >
          متابعة الفريق ←
        </Link>
      </div>
    </motion.article>
  );
}
