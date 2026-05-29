import type { TeamSlug, TeamTheme } from "./types";

export const TEAM_SLUGS: TeamSlug[] = [
  "al-hamoul",
  "matoubas",
  "abo-al-matameer",
  "al-dalangat",
  "farshout",
  "al-tramssa",
];

/** ألوان مميزة لكل فريق — فاتحة ومناسبة للسياق الكنسي */
export const TEAM_THEMES: Record<TeamSlug, TeamTheme> = {
  "al-hamoul": {
    slug: "al-hamoul",
    nameAr: "الحامول",
    primary: "#3d5a6c",
    secondary: "#4a7084",
    accent: "#2d4a5c",
    gradientFrom: "#e8f1f5",
    gradientTo: "#ffffff",
    emoji: "✝️",
  },
  matoubas: {
    slug: "matoubas",
    nameAr: "مطوبس",
    primary: "#96743a",
    secondary: "#b8924a",
    accent: "#6b5228",
    gradientFrom: "#faf3e4",
    gradientTo: "#ffffff",
    emoji: "🌾",
  },
  "abo-al-matameer": {
    slug: "abo-al-matameer",
    nameAr: "أبو المطامير",
    primary: "#722f37",
    secondary: "#8b4049",
    accent: "#5a2430",
    gradientFrom: "#f9ecee",
    gradientTo: "#ffffff",
    emoji: "⛪",
  },
  "al-dalangat": {
    slug: "al-dalangat",
    nameAr: "الدلنجات",
    primary: "#5c4a6e",
    secondary: "#746089",
    accent: "#453858",
    gradientFrom: "#f0ebf5",
    gradientTo: "#ffffff",
    emoji: "🕊️",
  },
  farshout: {
    slug: "farshout",
    nameAr: "فرشوط",
    primary: "#3a5248",
    secondary: "#4d6b5c",
    accent: "#2a3d34",
    gradientFrom: "#eaf2ed",
    gradientTo: "#ffffff",
    emoji: "🫒",
  },
  "al-tramssa": {
    slug: "al-tramssa",
    nameAr: "الترامسة",
    primary: "#4a5c3a",
    secondary: "#5e7348",
    accent: "#364428",
    gradientFrom: "#eef3e8",
    gradientTo: "#ffffff",
    emoji: "🌿",
  },
};

export function isTeamSlug(value: string): value is TeamSlug {
  return TEAM_SLUGS.includes(value as TeamSlug);
}

export function getTeamTheme(slug: TeamSlug): TeamTheme {
  return TEAM_THEMES[slug];
}
