import type { TeamSlug } from "./types";
import { TEAM_THEMES, isTeamSlug } from "./teams";

/** يطابق عمود Team في الشيت (slug أو اسم عربي) */
export function resolveTeamSlug(raw: string): TeamSlug | "" {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const lower = trimmed.toLowerCase();
  if (isTeamSlug(lower)) return lower;

  for (const slug of Object.keys(TEAM_THEMES) as TeamSlug[]) {
    const nameAr = TEAM_THEMES[slug].nameAr;
    if (
      trimmed === nameAr ||
      trimmed.includes(nameAr) ||
      nameAr.includes(trimmed)
    ) {
      return slug;
    }
  }

  return "";
}

export function teamLabelFromSlug(slug: TeamSlug | "", fallback = ""): string {
  if (slug && TEAM_THEMES[slug]) return TEAM_THEMES[slug].nameAr;
  return fallback;
}
