import Link from "next/link";
import { FestivalBackground } from "@/components/FestivalBackground";
import { ParticipantsLeaderboard } from "@/components/ParticipantsLeaderboard";
import { SiteHeader } from "@/components/SiteHeader";

export const revalidate = 30;

export const metadata = {
  title: "ترتيب المشاركين | مهرجان الكرازة",
};

export default function ScoresPage() {
  return (
    <div className="min-h-screen pb-16">
      <FestivalBackground />
      <SiteHeader
        title="ترتيب المشاركين"
        subtitle="بعدد النقاط — من الأعلى إلى الأقل"
        backHref="/"
      />
      <main className="relative mx-auto max-w-3xl px-4 py-8">
        <ParticipantsLeaderboard limit={500} showViewAll={false} />
        <p className="mt-6 text-center text-sm text-[var(--festival-ink-muted)]">
          <Link href="/attendance" className="text-gold hover:underline">
            تسجيل حضور جديد
          </Link>
        </p>
      </main>
    </div>
  );
}
