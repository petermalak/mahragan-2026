export type TeamSlug =
  | "al-hamoul"
  | "matoubas"
  | "abo-al-matameer"
  | "al-dalangat"
  | "farshout"
  | "al-tramssa";

export interface TeamTheme {
  slug: TeamSlug;
  nameAr: string;
  primary: string;
  secondary: string;
  accent: string;
  gradientFrom: string;
  gradientTo: string;
  emoji: string;
}

export interface TeamState {
  slug: TeamSlug;
  nameAr: string;
  geldr: number;
  houses: number;
  markets: number;
  landFixed: number;
  crops: number;
  tradeVolume: number;
  satisfaction: number;
  notes: string;
  updatedAt: string;
}

export interface TeamWithMax extends TeamState {
  maxGeldr: number;
  maxHouses: number;
  maxMarkets: number;
  maxLandFixed: number;
  maxCrops: number;
  maxTradeVolume: number;
}
