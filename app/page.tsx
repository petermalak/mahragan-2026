import { CollapsibleScoringGuide } from "@/components/ScoringGuide";
import { FestivalBackground } from "@/components/FestivalBackground";
import { HomeHero } from "@/components/HomeHero";
import { Leaderboard } from "@/components/Leaderboard";
import { SheetsWarningBanner } from "@/components/SheetsWarningBanner";
import { SiteHeader } from "@/components/SiteHeader";
import { TeamCard } from "@/components/TeamCard";
import { WelcomeHero } from "@/components/WelcomeHero";
import { getAllTeamsEnriched } from "@/lib/sheets";

export const revalidate = 30;

export default async function HomePage() {
  const { teams, warning } = await getAllTeamsEnriched();
  const byGeldr = [...teams].sort((a, b) => b.geldr - a.geldr);
  const rankMap = new Map(byGeldr.map((t, i) => [t.slug, i + 1]));

  return (
    <div className="min-h-screen pb-16">
      <FestivalBackground />
      <SiteHeader />
      <main className="relative mx-auto max-w-6xl px-4 py-8 md:py-10">
        {warning ? <SheetsWarningBanner warning={warning} /> : null}
        <WelcomeHero />
        <HomeHero />
        <div className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team, i) => (
            <TeamCard
              key={team.slug}
              team={team}
              index={i}
              rank={rankMap.get(team.slug)}
            />
          ))}
        </div>
        <Leaderboard teams={teams} />
        <CollapsibleScoringGuide />
      </main>
    </div>
  );
}
