import { FestivalBackground } from "@/components/FestivalBackground";
import { AttendanceFlowClient } from "@/components/AttendanceFlowClient";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "تسجيل الحضور | مهرجان الكرازة",
  description: "مسح QR Code وتسجيل نقاط الحضور",
};

interface AttendancePageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function AttendancePage({
  searchParams,
}: AttendancePageProps) {
  const { id } = await searchParams;

  return (
    <div className="min-h-screen pb-16">
      <FestivalBackground />
      <SiteHeader
        title="تسجيل الحضور"
        subtitle="مسح متعدد · حفظ دفعة واحدة"
        backHref="/"
      />
      <main className="relative mx-auto max-w-6xl px-4 py-8">
        <AttendanceFlowClient initialId={id?.trim()} />
      </main>
    </div>
  );
}
