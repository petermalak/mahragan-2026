import { notFound } from "next/navigation";
import { FestivalBackground } from "@/components/FestivalBackground";
import { GeldrCounter } from "@/components/GeldrCounter";
import { OrganizerNote } from "@/components/OrganizerNote";
import { SatisfactionGauge } from "@/components/SatisfactionGauge";
import { ScoringPhases } from "@/components/ScoringPhases";
import { SheetsWarningBanner } from "@/components/SheetsWarningBanner";
import { SiteHeader } from "@/components/SiteHeader";
import { StatBar } from "@/components/StatBar";
import { TeamRankBanner } from "@/components/TeamRankBanner";
import { TeamPageMotion, TeamPageSection } from "@/components/TeamPageMotion";
import { VillageScene } from "@/components/VillageScene";
import { TRADE_RULES } from "@/lib/festival";
import { getCurrentPhaseNumber } from "@/lib/phases";
import { TEAM_SLUGS, getTeamTheme, isTeamSlug } from "@/lib/teams";
import { getAllTeamsEnriched, getTeamBySlug } from "@/lib/sheets";
import type { TeamSlug } from "@/lib/types";

export const revalidate = 30;

interface TeamPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return TEAM_SLUGS.map((slug) => ({ slug }));
}

function formatUpdatedAt(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;

  if (!isTeamSlug(slug)) {
    notFound();
  }

  const { team, warning } = await getTeamBySlug(slug as TeamSlug);
  if (!team) {
    notFound();
  }

  const { teams: allTeams } = await getAllTeamsEnriched();
  const sorted = [...allTeams].sort((a, b) => b.geldr - a.geldr);
  const rank = sorted.findIndex((t) => t.slug === team.slug) + 1;

  const theme = getTeamTheme(team.slug);
  const currentPhase = getCurrentPhaseNumber({
    houses: team.houses,
    markets: team.markets,
    landFixed: team.landFixed,
    crops: team.crops,
    tradeVolume: team.tradeVolume,
    maxLandFixed: team.maxLandFixed,
    maxCrops: team.maxCrops,
    maxTradeVolume: team.maxTradeVolume,
  });

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${theme.gradientFrom} 0%, var(--festival-bg) 50%)`,
      }}
    >
      <FestivalBackground />
      <SiteHeader
        title={`فريق ${team.nameAr}`}
        subtitle={`المرحلة ${currentPhase} من 4 · فريق ${team.nameAr}`}
        backHref="/"
      />
      <main className="relative mx-auto max-w-6xl px-4 py-8">
        <TeamPageMotion>
          {warning ? (
            <TeamPageSection>
              <SheetsWarningBanner warning={warning} />
            </TeamPageSection>
          ) : null}
          <TeamPageSection>
            <TeamRankBanner
              team={team}
              rank={rank}
              totalTeams={allTeams.length}
            />
            <p className="mb-6 text-center text-sm text-[var(--festival-ink-muted)]">
              آخر تحديث: {formatUpdatedAt(team.updatedAt)}
            </p>
          </TeamPageSection>

          <TeamPageSection className="mb-8">
            <VillageScene
              team={team}
              primary={theme.primary}
              secondary={theme.secondary}
              accent={theme.accent}
              currentPhase={currentPhase}
            />
          </TeamPageSection>

          <TeamPageSection className="mb-8 grid gap-6 lg:grid-cols-2">
            <GeldrCounter
              value={team.geldr}
              primary={theme.primary}
              accent={theme.accent}
            />
            <SatisfactionGauge
              value={team.satisfaction}
              primary={theme.primary}
              accent={theme.accent}
            />
          </TeamPageSection>

          <TeamPageSection className="mb-8">
            <ScoringPhases
              houses={team.houses}
              markets={team.markets}
              landFixed={team.landFixed}
              crops={team.crops}
              tradeVolume={team.tradeVolume}
              maxLandFixed={team.maxLandFixed}
              maxCrops={team.maxCrops}
              maxTradeVolume={team.maxTradeVolume}
              primary={theme.primary}
              accent={theme.accent}
            />
          </TeamPageSection>

          <TeamPageSection className="mb-6">
            <div className="church-card px-5 py-4 text-sm opacity-80">
              <strong className="text-gold">{TRADE_RULES.title}:</strong>{" "}
              {TRADE_RULES.summary}
            </div>
          </TeamPageSection>

          <TeamPageSection className="mb-8 grid gap-4 sm:grid-cols-2">
            <StatBar
              label="البيوت (مرحلة 1)"
              value={team.houses}
              max={Math.max(team.maxHouses, 4)}
              icon="🏠"
              accent={theme.accent}
              delay={0}
            />
            <StatBar
              label="الأسواق (مرحلة 1)"
              value={team.markets}
              max={Math.max(team.maxMarkets, 1)}
              icon="🛒"
              accent={theme.accent}
              delay={0.05}
            />
            <StatBar
              label="أراضٍ مُصلَحة (مرحلة 2)"
              value={team.landFixed}
              max={team.maxLandFixed}
              icon="🌾"
              accent={theme.accent}
              delay={0.1}
            />
            <StatBar
              label="المحاصيل (مرحلة 3)"
              value={team.crops}
              max={team.maxCrops}
              icon="🌱"
              accent={theme.accent}
              delay={0.15}
            />
            <StatBar
              label="التداول (مرحلة 4)"
              value={team.tradeVolume}
              max={team.maxTradeVolume}
              icon="💱"
              accent={theme.accent}
              delay={0.2}
            />
          </TeamPageSection>

          {team.notes ? (
            <TeamPageSection>
              <OrganizerNote text={team.notes} accent={theme.accent} />
            </TeamPageSection>
          ) : null}
        </TeamPageMotion>
      </main>
    </div>
  );
}
