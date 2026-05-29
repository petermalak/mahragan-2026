import type { TeamWithMax } from "./types";

function pct(current: number, target: number): number {
  if (target <= 0) return 100;
  return Math.min(100, Math.round((current / target) * 100));
}

export interface VillageVisualState {
  housesBuilt: number;
  housesExtra: number;
  hasMarket: boolean;
  marketCount: number;
  landProgress: number;
  cropProgress: number;
  tradeProgress: number;
  fieldPlotsReclaimed: number;
  fieldPlotsWithCrops: number;
  satisfactionMood: "starting" | "content" | "happy" | "joyful";
  phaseLabels: [string, string, string, string];
}

const FIELD_PLOTS = 8;
const CROP_PLOTS = 12;

export function getVillageVisualState(team: TeamWithMax): VillageVisualState {
  const landTarget = Math.max(team.maxLandFixed, 8);
  const cropTarget = Math.max(team.maxCrops, 15);
  const tradeTarget = Math.max(team.maxTradeVolume, 200);

  const landProgress = pct(team.landFixed, landTarget);
  const cropProgress = pct(team.crops, cropTarget);
  const tradeProgress = pct(team.tradeVolume, tradeTarget);

  const fieldPlotsReclaimed = Math.round((landProgress / 100) * FIELD_PLOTS);
  const fieldPlotsWithCrops = Math.round((cropProgress / 100) * CROP_PLOTS);

  let satisfactionMood: VillageVisualState["satisfactionMood"] = "starting";
  if (team.satisfaction >= 88) satisfactionMood = "joyful";
  else if (team.satisfaction >= 63) satisfactionMood = "happy";
  else if (team.satisfaction >= 38) satisfactionMood = "content";

  return {
    housesBuilt: Math.min(4, team.houses),
    housesExtra: Math.max(0, team.houses - 4),
    hasMarket: team.markets >= 1,
    marketCount: team.markets,
    landProgress,
    cropProgress,
    tradeProgress,
    fieldPlotsReclaimed,
    fieldPlotsWithCrops,
    satisfactionMood,
    phaseLabels: [
      `${Math.min(team.houses, 4)}/4 بيوت · ${team.markets}/1 سوق`,
      `${team.landFixed} أرض مُصلَحة`,
      `${team.crops} محصول`,
      `${team.tradeVolume} تداول`,
    ],
  };
}

export { FIELD_PLOTS, CROP_PLOTS };
