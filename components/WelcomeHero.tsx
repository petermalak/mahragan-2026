"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FestivalLogos } from "@/components/FestivalLogos";
import { ScriptureTagline } from "@/components/ScriptureTagline";
import { FESTIVAL } from "@/lib/festival";

export function WelcomeHero() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="church-card-elevated relative mb-10 overflow-hidden px-6 py-8 md:px-10 md:py-10"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-60"
        style={{ background: FESTIVAL.cardShine }}
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <FestivalLogos size="lg" className="mb-6" showLabels />

        <ScriptureTagline className="mb-2 text-sm" />
        <h2 className="section-title mb-1 text-2xl md:text-3xl">
          {FESTIVAL.nameAr}
        </h2>
        <p className="mb-4 text-xs text-[var(--festival-maroon)]">
          {FESTIVAL.churchNameEn}
        </p>
        <p className="section-subtitle mx-auto max-w-lg leading-relaxed">
          نظام التقييم والمنافسة — متابعة تقدّم فرق المهرجان في بناء القرية،
          جمع {FESTIVAL.currency}، إتمام المراحل، ومؤشر رضا السكان. البيانات
          تُحدَّث تلقائياً كل 30 ثانية.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3 text-xs text-[var(--festival-ink-muted)]">
          <span
            className="rounded-full px-3 py-1"
            style={{ background: "var(--festival-sky-blue)" }}
          >
            {FESTIVAL.yearGregorian}
          </span>
          <span
            className="rounded-full px-3 py-1"
            style={{
              background: "rgba(139, 26, 26, 0.08)",
              color: "var(--festival-maroon)",
            }}
          >
            {FESTIVAL.yearCoptic}
          </span>
        </div>

        <div
          className="mx-auto mt-6 h-0.5 w-20 opacity-70"
          style={{ background: FESTIVAL.goldGradient }}
        />
      </div>
    </motion.section>
  );
}
