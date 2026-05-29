import { notFound } from "next/navigation";
import { FloatingBackground } from "@/components/FloatingBackground";
import { GeldrCounter } from "@/components/GeldrCounter";
import { OrganizerNote } from "@/components/OrganizerNote";
import { SatisfactionGauge } from "@/components/SatisfactionGauge";
import { SheetsWarningBanner } from "@/components/SheetsWarningBanner";
import { SiteHeader } from "@/components/SiteHeader";
import { StatBar } from "@/components/StatBar";
import { TeamPageMotion, TeamPageSection } from "@/components/TeamPageMotion";
import { VillageScene } from "@/components/VillageScene";
import { TEAM_SLUGS, getTeamTheme, isTeamSlug } from "@/lib/teams";
import { getTeamBySlug } from "@/lib/sheets";
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

  const theme = getTeamTheme(team.slug);

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${theme.gradientFrom} 0%, #0b1020 45%)`,
      }}
    >
      <FloatingBackground accent={theme.accent} />
      <SiteHeader
        title={`قرية ${team.nameAr}`}
        subtitle={`${theme.emoji} فريق ${team.nameAr}`}
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
            <p className="mb-6 text-center text-sm text-white/55">
              آخر تحديث: {formatUpdatedAt(team.updatedAt)}
            </p>
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
            <VillageScene
              houses={team.houses}
              markets={team.markets}
              landFixed={team.landFixed}
              crops={team.crops}
              tradeVolume={team.tradeVolume}
              primary={theme.primary}
              secondary={theme.secondary}
              accent={theme.accent}
            />
          </TeamPageSection>

          <TeamPageSection className="mb-8 grid gap-4 sm:grid-cols-2">
            <StatBar
              label="البيوت"
              value={team.houses}
              max={team.maxHouses}
              icon="🏠"
              accent={theme.accent}
              delay={0}
            />
            <StatBar
              label="الأسواق"
              value={team.markets}
              max={team.maxMarkets}
              icon="🛒"
              accent={theme.accent}
              delay={0.05}
            />
            <StatBar
              label="أراضٍ مُصلَحة"
              value={team.landFixed}
              max={team.maxLandFixed}
              icon="🌾"
              accent={theme.accent}
              delay={0.1}
            />
            <StatBar
              label="المحاصيل"
              value={team.crops}
              max={team.maxCrops}
              icon="🌱"
              accent={theme.accent}
              delay={0.15}
            />
            <StatBar
              label="حجم التداول"
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
