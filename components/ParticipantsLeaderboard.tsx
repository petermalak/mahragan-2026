import Link from "next/link";
import { CountUp } from "@/components/CountUp";
import { getParticipantsLeaderboard } from "@/lib/attendance";
import { getTeamTheme } from "@/lib/teams";
import type { TeamSlug } from "@/lib/types";

interface ParticipantsLeaderboardProps {
  limit?: number;
  showViewAll?: boolean;
}

export async function ParticipantsLeaderboard({
  limit = 15,
  showViewAll = true,
}: ParticipantsLeaderboardProps) {
  const { participants, demo } = await getParticipantsLeaderboard();
  const top = participants.slice(0, limit);

  if (top.length === 0) return null;

  return (
    <section className="church-card mb-10 overflow-hidden">
      <div
        className="flex flex-wrap items-end justify-between gap-3 border-b px-5 py-4"
        style={{ borderColor: "var(--festival-border)" }}
      >
        <div>
          <h2 className="section-title text-lg md:text-xl">ترتيب المشاركين</h2>
          <p className="section-subtitle">
            بعدد النقاط — من الأعلى إلى الأقل
            {!showViewAll && participants.length > 0
              ? ` · ${participants.length} مشارك`
              : ""}
          </p>
        </div>
        {showViewAll && participants.length > limit ? (
          <Link href="/scores" className="text-sm font-semibold text-gold hover:underline">
            عرض الكل ({participants.length})
          </Link>
        ) : null}
      </div>

      {demo ? (
        <p
          className="border-b px-5 py-2 text-xs text-amber-800"
          style={{
            borderColor: "var(--festival-border)",
            background: "#fffbeb",
          }}
        >
          بيانات تجريبية — تأكد من تبويب users والصلاحيات
        </p>
      ) : null}

      <ol className="divide-y" style={{ borderColor: "var(--festival-border)" }}>
        {top.map((p, index) => {
          const rank = index + 1;
          const theme = p.teamSlug ? getTeamTheme(p.teamSlug as TeamSlug) : null;
          const medal =
            rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;

          return (
            <li
              key={p.id}
              className="flex items-center gap-3 px-5 py-3.5 sm:gap-4"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold sm:h-10 sm:w-10"
                style={{
                  background:
                    rank <= 3 && theme
                      ? `${theme.primary}18`
                      : "var(--festival-surface)",
                  color:
                    rank <= 3 && theme
                      ? theme.primary
                      : "var(--festival-ink-muted)",
                }}
              >
                {medal}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-[var(--festival-ink)]">
                  {theme ? `${theme.emoji} ` : ""}
                  {p.nameAr}
                </p>
                <p className="truncate text-xs text-[var(--festival-ink-muted)]">
                  {p.className}
                  {p.teamLabel ? ` · ${p.teamLabel}` : ""}
                </p>
              </div>
              <div className="shrink-0 text-left">
                <p className="font-bold tabular-nums text-gold text-lg sm:text-xl">
                  <CountUp value={p.points} />
                </p>
                <p className="text-[10px] text-[var(--festival-ink-muted)]">
                  نقطة
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
