import type { TeamSlug, TeamTheme } from "./types";

export const TEAM_SLUGS: TeamSlug[] = [
  "al-hamoul",
  "matoubas",
  "abo-al-matameer",
  "al-dalangat",
  "farshout",
  "al-tramssa",
];

export const TEAM_THEMES: Record<TeamSlug, TeamTheme> = {
  "al-hamoul": {
    slug: "al-hamoul",
    nameAr: "الحامول",
    primary: "#0d9488",
    secondary: "#14b8a6",
    accent: "#5eead4",
    gradientFrom: "#042f2e",
    gradientTo: "#115e59",
    emoji: "🌊",
  },
  matoubas: {
    slug: "matoubas",
    nameAr: "مطوبس",
    primary: "#ca8a04",
    secondary: "#eab308",
    accent: "#fde047",
    gradientFrom: "#422006",
    gradientTo: "#854d0e",
    emoji: "🌾",
  },
  "abo-al-matameer": {
    slug: "abo-al-matameer",
    nameAr: "أبو المطامير",
    primary: "#dc2626",
    secondary: "#f87171",
    accent: "#fca5a5",
    gradientFrom: "#450a0a",
    gradientTo: "#991b1b",
    emoji: "🏛️",
  },
  "al-dalangat": {
    slug: "al-dalangat",
    nameAr: "الدلنجات",
    primary: "#7c3aed",
    secondary: "#a78bfa",
    accent: "#c4b5fd",
    gradientFrom: "#2e1065",
    gradientTo: "#5b21b6",
    emoji: "🌸",
  },
  farshout: {
    slug: "farshout",
    nameAr: "فرشوط",
    primary: "#2563eb",
    secondary: "#60a5fa",
    accent: "#93c5fd",
    gradientFrom: "#172554",
    gradientTo: "#1d4ed8",
    emoji: "🫒",
  },
  "al-tramssa": {
    slug: "al-tramssa",
    nameAr: "الترامسة",
    primary: "#059669",
    secondary: "#34d399",
    accent: "#6ee7b7",
    gradientFrom: "#064e3b",
    gradientTo: "#047857",
    emoji: "🌴",
  },
};

export function isTeamSlug(value: string): value is TeamSlug {
  return TEAM_SLUGS.includes(value as TeamSlug);
}

export function getTeamTheme(slug: TeamSlug): TeamTheme {
  return TEAM_THEMES[slug];
}
