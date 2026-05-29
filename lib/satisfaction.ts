import { SATISFACTION_TIERS } from "./festival";

export interface SatisfactionInput {
  houses: number;
  markets: number;
  landFixed: number;
  crops: number;
  tradeVolume: number;
}

const WEIGHTS = {
  houses: 4,
  markets: 6,
  landFixed: 3,
  crops: 2,
  tradeCap: 25,
  tradeDivisor: 10,
} as const;

export function calculateSatisfaction(stats: SatisfactionInput): number {
  const tradeBonus = Math.min(
    stats.tradeVolume / WEIGHTS.tradeDivisor,
    WEIGHTS.tradeCap,
  );
  const raw =
    stats.houses * WEIGHTS.houses +
    stats.markets * WEIGHTS.markets +
    stats.landFixed * WEIGHTS.landFixed +
    stats.crops * WEIGHTS.crops +
    tradeBonus;
  return Math.min(100, Math.round(raw));
}

export function resolveSatisfaction(
  manual: number | null | undefined,
  stats: SatisfactionInput,
): number {
  if (
    manual !== null &&
    manual !== undefined &&
    !Number.isNaN(manual) &&
    manual >= 0 &&
    manual <= 100
  ) {
    return Math.round(manual);
  }
  return calculateSatisfaction(stats);
}

/** مستويات مؤشر الرضا من العرض: 25% · 50% · 75% · 100% */
export function satisfactionLabel(value: number): string {
  for (const tier of SATISFACTION_TIERS) {
    if (value >= tier.min) return tier.label;
  }
  return "في بداية الرحلة";
}

export function satisfactionTier(value: number) {
  for (const tier of SATISFACTION_TIERS) {
    if (value >= tier.min) return tier;
  }
  return { min: 0, label: "في بداية الرحلة", pct: 0, emoji: "🌱" };
}
