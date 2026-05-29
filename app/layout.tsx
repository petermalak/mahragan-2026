import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { FESTIVAL } from "@/lib/festival";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: `${FESTIVAL.nameAr} | نظام التقييم`,
  description: `نظام التقييم والمنافسة — ${FESTIVAL.currency}، مراحل بناء القرية، ومؤشر الرضا`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full`}>
      <body className="min-h-full bg-[var(--festival-bg)] font-sans text-[var(--festival-cream)] antialiased">
        {children}
      </body>
    </html>
  );
}
