"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FESTIVAL } from "@/lib/festival";
import { slideFromRight } from "@/lib/motion";

interface SiteHeaderProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
}

export function SiteHeader({
  title = FESTIVAL.nameAr,
  subtitle = `نظام التقييم والمنافسة — ${FESTIVAL.currency}`,
  backHref,
}: SiteHeaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className="border-b border-[var(--festival-gold)]/20 bg-black/40 backdrop-blur-md"
      initial={reduceMotion ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          variants={slideFromRight}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.05 }}
        >
          <p className="mb-1 text-xs font-medium text-[var(--festival-gold)]">
            {FESTIVAL.tagline}
          </p>
          <h1 className="text-xl font-bold text-[var(--festival-cream)] md:text-2xl">
            {title}
          </h1>
          <motion.p
            className="text-sm text-white/60"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {subtitle}
          </motion.p>
        </motion.div>
        <nav className="flex gap-3 text-sm">
          {backHref ? (
            <motion.div
              whileHover={reduceMotion ? {} : { scale: 1.04 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
            >
              <Link
                href={backHref}
                className="inline-block rounded-lg border border-[var(--festival-gold)]/35 px-4 py-2 text-[var(--festival-cream)] transition-colors hover:bg-[var(--festival-gold)]/10"
              >
                ← كل الفرق
              </Link>
            </motion.div>
          ) : (
            <span className="rounded-lg border border-[var(--festival-gold)]/25 bg-[var(--festival-gold)]/10 px-4 py-2 text-[var(--festival-gold-light)]">
              6 فرق
            </span>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
