"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FestivalLogos } from "@/components/FestivalLogos";
import { ScriptureTagline } from "@/components/ScriptureTagline";
import { FESTIVAL } from "@/lib/festival";

interface SiteHeaderProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
}

export function SiteHeader({
  title = FESTIVAL.nameAr,
  subtitle = `نظام التقييم · ${FESTIVAL.currency}`,
  backHref,
}: SiteHeaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        background: "rgba(254, 249, 231, 0.94)",
        borderColor: "var(--festival-border)",
      }}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div
        className="h-1 w-full"
        style={{ background: FESTIVAL.goldGradient }}
      />
      <div
        className="h-0.5 w-full opacity-70"
        style={{ background: FESTIVAL.blueGradient }}
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <FestivalLogos size="sm" />
          <div>
            <ScriptureTagline
              className="mb-0.5 text-xs"
              refClassName="text-[var(--festival-ink-muted)] text-[11px]"
            />
            <h1 className="text-lg font-bold text-royal md:text-xl">{title}</h1>
            <p className="section-subtitle">{subtitle}</p>
          </div>
        </div>
        <nav className="shrink-0">
          {backHref ? (
            <Link href={backHref} className="btn-secondary text-sm">
              ← العودة للفرق
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--festival-border)] bg-[var(--festival-sky-blue)] px-3 py-1.5 text-xs text-royal">
              <span>{FESTIVAL.yearGregorian}</span>
              <span className="opacity-40">·</span>
              <span>{FESTIVAL.yearCoptic}</span>
            </span>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
