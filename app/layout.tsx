import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "مهرجان القرى 2026 | تسابق الجلدر",
  description:
    "نظام عرض تسابق القرى — 6 فرق، عملة الجلدر، ومؤشر رضا القرية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full`}>
      <body className="min-h-full bg-[#0b1020] font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
