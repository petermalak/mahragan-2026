import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b1020]">
      <SiteHeader title="الصفحة غير موجودة" subtitle="" backHref="/" />
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="mb-6 text-6xl">🏜️</p>
        <h2 className="mb-4 text-2xl font-bold">لم نجد هذه القرية</h2>
        <Link
          href="/"
          className="inline-block rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white"
        >
          العودة للفرق
        </Link>
      </main>
    </div>
  );
}
