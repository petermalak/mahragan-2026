import { FloatingBackground } from "@/components/FloatingBackground";
import { HomeHero } from "@/components/HomeHero";
import { SheetsWarningBanner } from "@/components/SheetsWarningBanner";
import { SiteHeader } from "@/components/SiteHeader";
import { TeamCard } from "@/components/TeamCard";
import { getAllTeamsEnriched } from "@/lib/sheets";

export const revalidate = 30;

export default async function HomePage() {
  const { teams, warning } = await getAllTeamsEnriched();

  return (
    <div className="min-h-screen">
      <FloatingBackground accent="#14b8a6" />
      <SiteHeader />
      <main className="relative mx-auto max-w-6xl px-4 py-10">
        {warning ? <SheetsWarningBanner warning={warning} /> : null}
        <HomeHero />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team, i) => (
            <TeamCard key={team.slug} team={team} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
