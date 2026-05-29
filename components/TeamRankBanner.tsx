"use client";

import Link from "next/link";
import { getTeamTheme } from "@/lib/teams";
import type { TeamWithMax } from "@/lib/types";

interface TeamRankBannerProps {
  team: TeamWithMax;
  rank: number;
  totalTeams: number;
}

export function TeamRankBanner({ team, rank, totalTeams }: TeamRankBannerProps) {
  const theme = getTeamTheme(team.slug);

  return (
    <div
      className="church-card mb-6 flex flex-wrap items-center justify-between gap-4 px-5 py-4"
      style={{ borderRightColor: theme.primary, borderRightWidth: 3 }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{theme.emoji}</span>
        <div>
          <p className="text-xs text-[var(--festival-ink-muted)]">
            الترتيب بين الفرق
          </p>
          <p className="text-xl font-bold text-[var(--festival-ink)]">
            #{rank}{" "}
            <span className="text-sm font-normal text-[var(--festival-ink-muted)]">
              من {totalTeams}
            </span>
          </p>
        </div>
      </div>
      <Link
        href="/"
        className="text-sm text-gold underline-offset-2 hover:underline"
      >
        عرض كل الفرق
      </Link>
    </div>
  );
}
