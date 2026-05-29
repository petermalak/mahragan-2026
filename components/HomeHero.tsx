"use client";

import { motion, useReducedMotion } from "framer-motion";

export function HomeHero() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="mb-8 text-center"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-[var(--festival-cream)] md:text-3xl">
        فرق المهرجان
      </h2>
      <p className="mt-2 text-sm text-white/60">
        اختر فريقاً لمتابعة الجلدر، المراحل، ومؤشر الرضا
      </p>
      <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-l from-transparent via-[var(--festival-gold)] to-transparent" />
    </motion.section>
  );
}
