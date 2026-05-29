"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { SCORING_PHASES, getPhaseProgressList } from "@/lib/phases";
import { getVillageVisualState } from "@/lib/villageVisual";
import type { TeamWithMax } from "@/lib/types";

const VillageCanvas = dynamic(() => import("@/components/village/VillageCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(420px,60vh)] items-center justify-center bg-[var(--festival-sky-blue)]">
      <p className="text-sm text-[var(--festival-ink-muted)]">جاري تحميل القرية…</p>
    </div>
  ),
});

interface VillageSceneProps {
  team: TeamWithMax;
  primary: string;
  secondary: string;
  accent: string;
  currentPhase: number;
}

const MOOD = {
  starting: { label: "في بداية البناء" },
  content: { label: "قرية نامية" },
  happy: { label: "قرية مزدهرة" },
  joyful: { label: "قرية سعيدة" },
} as const;

export function VillageScene({
  team,
  primary,
  secondary,
  accent,
  currentPhase,
}: VillageSceneProps) {
  const reduceMotion = useReducedMotion();
  const visual = getVillageVisualState(team);
  const mood = MOOD[visual.satisfactionMood];
  const phaseProgress = getPhaseProgressList({
    houses: team.houses,
    markets: team.markets,
    landFixed: team.landFixed,
    crops: team.crops,
    tradeVolume: team.tradeVolume,
    maxLandFixed: team.maxLandFixed,
    maxCrops: team.maxCrops,
    maxTradeVolume: team.maxTradeVolume,
  });

  return (
    <section className="church-card-elevated overflow-hidden">
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
        style={{ borderColor: "var(--festival-border)" }}
      >
        <div>
          <h2 className="section-title text-lg">قرية {team.nameAr}</h2>
          <p className="section-subtitle">
            {mood.label} · المرحلة {currentPhase} من 4
          </p>
        </div>
        <div
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: `${primary}14`, color: accent }}
        >
          رضا السكان {team.satisfaction}%
        </div>
      </div>

      <div className="relative">
        <div className="h-[min(420px,60vh)] w-full">
          <VillageCanvas
            team={team}
            primary={primary}
            secondary={secondary}
            accent={accent}
            animate={!reduceMotion}
          />
        </div>
        <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-[10px] text-[var(--festival-ink-muted)] shadow-sm backdrop-blur-sm">
          اسحب للدوران · Scroll للتكبير
        </p>
      </div>

      <div
        className="grid grid-cols-2 gap-2 border-t px-4 py-4 sm:grid-cols-4"
        style={{ borderColor: "var(--festival-border)" }}
      >
        {SCORING_PHASES.map((phase, i) => {
          const progress = phaseProgress[i];
          const active = progress.currentPhase;
          const done = progress.complete;
          return (
            <div
              key={phase.id}
              className="rounded-lg px-3 py-2 text-center text-xs transition-colors"
              style={{
                background: active
                  ? `${primary}14`
                  : done
                    ? "rgba(74, 107, 78, 0.1)"
                    : "var(--festival-surface)",
                border: active
                  ? `1px solid ${primary}44`
                  : "1px solid var(--festival-border)",
              }}
            >
              <span className="text-base">{phase.icon}</span>
              <p className="mt-1 font-semibold text-[var(--festival-ink)]">
                {phase.title}
              </p>
              <p className="text-[10px] text-[var(--festival-ink-muted)]">
                {visual.phaseLabels[i]}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
