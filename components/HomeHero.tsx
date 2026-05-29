"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";

export function HomeHero() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <section className="mb-10 text-center">
        <h2 className="mb-2 text-3xl font-bold">فرق المهرجان</h2>
        <p className="text-white/65">
          تابع بناء القرى، جمع الجلدر، ومؤشر الرضا لكل فريق
        </p>
      </section>
    );
  }

  return (
    <motion.section
      className="mb-10 text-center"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={staggerItem} className="mb-3 inline-block">
        <motion.span
          className="text-5xl"
          animate={{ rotate: [0, 8, -8, 0], y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🏘️
        </motion.span>
      </motion.div>
      <motion.h2
        variants={fadeUp}
        className="mb-2 bg-gradient-to-l from-teal-200 via-white to-amber-100 bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
      >
        فرق المهرجان
      </motion.h2>
      <motion.p variants={staggerItem} className="text-white/65">
        تابع بناء القرى، جمع الجلدر، ومؤشر الرضا لكل فريق
      </motion.p>
      <motion.div
        variants={staggerItem}
        className="mx-auto mt-4 h-1 w-24 overflow-hidden rounded-full bg-white/10"
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-l from-teal-400 to-amber-300"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "50%" }}
        />
      </motion.div>
    </motion.section>
  );
}
