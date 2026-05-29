"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/CountUp";
import { getTeamTheme } from "@/lib/teams";
import type { TeamWithMax } from "@/lib/types";

interface LeaderboardProps {
  teams: TeamWithMax[];
}

export function Leaderboard({ teams }: LeaderboardProps) {
  const reduceMotion = useReducedMotion();
  const sorted = [...teams].sort((a, b) => b.geldr - a.geldr);

  return (
    <section className="church-card mb-10 overflow-hidden">
      <div className="border-b px-5 py-4" style={{ borderColor: "var(--festival-border)" }}>
        <h2 className="section-title text-lg">ترتيب الفرق</h2>
        <p className="section-subtitle">حسب رصيد الجلدر</p>
      </div>

      <ol className="divide-y" style={{ borderColor: "var(--festival-border)" }}>
        {sorted.map((team, index) => {
          const theme = getTeamTheme(team.slug);
          const rank = index + 1;
          const medal =
            rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

          return (
            <motion.li
              key={team.slug}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.04 }}
            >
              <Link
                href={`/teams/${team.slug}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--festival-surface)]"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                  style={{
                    background: rank <= 3 ? `${theme.primary}18` : "var(--festival-surface)",
                    color: rank <= 3 ? theme.primary : "var(--festival-ink-muted)",
                  }}
                >
                  {medal ?? rank}
                </span>
                <span className="text-lg">{theme.emoji}</span>
                <span className="flex-1 font-medium text-[var(--festival-ink)]">
                  {team.nameAr}
                </span>
                <span className="font-bold tabular-nums text-gold">
                  <CountUp value={team.geldr} />
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
