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
          <h2 className="section-title text-lg">ترتيب المشاركين</h2>
          <p className="section-subtitle">حسب عمود Score في الشيت</p>
        </div>
        {showViewAll ? (
          <Link href="/scores" className="text-sm text-gold hover:underline">
            عرض الكل
          </Link>
        ) : null}
      </div>

      {demo ? (
        <p className="border-b px-5 py-2 text-xs text-amber-800" style={{ borderColor: "var(--festival-border)", background: "#fffbeb" }}>
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
              className="flex items-center gap-3 px-5 py-3 sm:gap-4"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold sm:h-9 sm:w-9 sm:text-sm"
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
                <p className="truncate font-medium text-[var(--festival-ink)]">
                  {theme ? `${theme.emoji} ` : ""}
                  {p.nameAr}
                </p>
                <p className="truncate text-xs text-[var(--festival-ink-muted)]">
                  {p.className}
                  {p.teamLabel ? ` · ${p.teamLabel}` : ""}
                </p>
              </div>
              <span className="shrink-0 font-bold tabular-nums text-gold">
                <CountUp value={p.points} />
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
