import type { TeamSlug, TeamTheme } from "./types";

export const TEAM_SLUGS: TeamSlug[] = [
  "al-hamoul",
  "matoubas",
  "abo-al-matameer",
  "al-dalangat",
  "farshout",
  "al-tramssa",
];

/** ألوان كل فريق ضمن طابع المهرجان ( burgundy / gold ) */
export const TEAM_THEMES: Record<TeamSlug, TeamTheme> = {
  "al-hamoul": {
    slug: "al-hamoul",
    nameAr: "الحامول",
    primary: "#7a2848",
    secondary: "#9e3a5c",
    accent: "#e8b86d",
    gradientFrom: "#3d0f28",
    gradientTo: "#5c1838",
    emoji: "⛪",
  },
  matoubas: {
    slug: "matoubas",
    nameAr: "مطوبس",
    primary: "#6b4423",
    secondary: "#8f5a2e",
    accent: "#f0d78c",
    gradientFrom: "#2a1808",
    gradientTo: "#4a3018",
    emoji: "🌾",
  },
  "abo-al-matameer": {
    slug: "abo-al-matameer",
    nameAr: "أبو المطامير",
    primary: "#8b1a2e",
    secondary: "#b52d45",
    accent: "#d4af37",
    gradientFrom: "#3a0818",
    gradientTo: "#5c1028",
    emoji: "🏛️",
  },
  "al-dalangat": {
    slug: "al-dalangat",
    nameAr: "الدلنجات",
    primary: "#5c2d6e",
    secondary: "#7a4090",
    accent: "#f5e6c8",
    gradientFrom: "#2a1038",
    gradientTo: "#401858",
    emoji: "✝️",
  },
  farshout: {
    slug: "farshout",
    nameAr: "فرشوط",
    primary: "#1e4d6e",
    secondary: "#2d6a94",
    accent: "#d4af37",
    gradientFrom: "#0a2030",
    gradientTo: "#143850",
    emoji: "🕊️",
  },
  "al-tramssa": {
    slug: "al-tramssa",
    nameAr: "الترامسة",
    primary: "#2d5a3d",
    secondary: "#3d7a52",
    accent: "#e8b86d",
    gradientFrom: "#0f2818",
    gradientTo: "#1a4030",
    emoji: "🌴",
  },
};

export function isTeamSlug(value: string): value is TeamSlug {
  return TEAM_SLUGS.includes(value as TeamSlug);
}

export function getTeamTheme(slug: TeamSlug): TeamTheme {
  return TEAM_THEMES[slug];
}
