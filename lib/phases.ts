import type { TeamState } from "./types";

export interface ScoringPhase {
  id: number;
  title: string;
  goal: string;
  icon: string;
}

export const SCORING_PHASES: ScoringPhase[] = [
  {
    id: 1,
    title: "المرحلة الأولى",
    goal: "بناء 4 بيوت وسوق",
    icon: "🏠",
  },
  {
    id: 2,
    title: "المرحلة الثانية",
    goal: "استصلاح الأراضي",
    icon: "🌾",
  },
  {
    id: 3,
    title: "المرحلة الثالثة",
    goal: "زراعة المحاصيل",
    icon: "🌱",
  },
  {
    id: 4,
    title: "المرحلة الرابعة",
    goal: "بيع المحاصيل والتداول",
    icon: "💱",
  },
];

export interface PhaseProgress {
  phase: ScoringPhase;
  progress: number;
  complete: boolean;
  detail: string;
  currentPhase: boolean;
}

interface PhaseStats {
  houses: number;
  markets: number;
  landFixed: number;
  crops: number;
  tradeVolume: number;
  maxLandFixed: number;
  maxCrops: number;
  maxTradeVolume: number;
}

function pct(current: number, target: number): number {
  if (target <= 0) return 100;
  return Math.min(100, Math.round((current / target) * 100));
}

export function getPhaseProgressList(stats: PhaseStats): PhaseProgress[] {
  const housePart = pct(stats.houses, 4) * 0.75;
  const marketPart = stats.markets >= 1 ? 25 : pct(stats.markets, 1) * 0.25;
  const phase1Progress = Math.round(housePart + marketPart);
  const phase1Complete = stats.houses >= 4 && stats.markets >= 1;

  const landTarget = Math.max(stats.maxLandFixed, 8);
  const cropTarget = Math.max(stats.maxCrops, 15);
  const tradeTarget = Math.max(stats.maxTradeVolume, 200);

  const phasesData = [
    {
      progress: phase1Progress,
      complete: phase1Complete,
      detail: `${stats.houses}/4 بيوت · ${stats.markets}/1 سوق`,
    },
    {
      progress: pct(stats.landFixed, landTarget),
      complete: stats.landFixed >= Math.ceil(landTarget * 0.6),
      detail: `${stats.landFixed} أرض مُصلَحة`,
    },
    {
      progress: pct(stats.crops, cropTarget),
      complete: stats.crops >= Math.ceil(cropTarget * 0.6),
      detail: `${stats.crops} محصول`,
    },
    {
      progress: pct(stats.tradeVolume, tradeTarget),
      complete: stats.tradeVolume >= Math.ceil(tradeTarget * 0.5),
      detail: `${stats.tradeVolume} حجم تداول`,
    },
  ];

  const firstIncomplete = phasesData.findIndex((p) => !p.complete);

  return SCORING_PHASES.map((phase, i) => ({
    phase,
    progress: phasesData[i].progress,
    complete: phasesData[i].complete,
    detail: phasesData[i].detail,
    currentPhase: firstIncomplete === -1 ? i === 3 : i === firstIncomplete,
  }));
}

export function getCurrentPhaseNumber(stats: PhaseStats): number {
  const list = getPhaseProgressList(stats);
  const current = list.find((p) => p.currentPhase);
  return current?.phase.id ?? 4;
}

export function getCompletedPhaseCount(stats: PhaseStats): number {
  return getPhaseProgressList(stats).filter((p) => p.complete).length;
}

export type TeamPhaseStats = Pick<
  TeamState,
  "houses" | "markets" | "landFixed" | "crops" | "tradeVolume"
> &
  Pick<PhaseStats, "maxLandFixed" | "maxCrops" | "maxTradeVolume">;
