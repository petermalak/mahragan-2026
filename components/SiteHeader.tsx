"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { slideFromRight } from "@/lib/motion";

interface SiteHeaderProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
}

export function SiteHeader({
  title = "مهرجان القرى 2026",
  subtitle = "تسابق بناء القرى — عملة الجلدر",
  backHref,
}: SiteHeaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className="border-b border-white/10 bg-black/30 backdrop-blur-md"
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
          <h1 className="text-2xl font-bold text-white md:text-3xl">{title}</h1>
          <motion.p
            className="text-sm text-white/65"
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
                className="inline-block rounded-lg border border-white/20 px-4 py-2 text-white/90 transition-colors hover:bg-white/10"
              >
                ← كل الفرق
              </Link>
            </motion.div>
          ) : (
            <motion.span
              className="rounded-lg bg-white/10 px-4 py-2 text-white/70"
              animate={
                reduceMotion
                  ? {}
                  : { boxShadow: ["0 0 0px transparent", "0 0 12px rgba(255,255,255,0.15)", "0 0 0px transparent"] }
              }
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              6 فرق
            </motion.span>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
