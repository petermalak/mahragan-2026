"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FESTIVAL } from "@/lib/festival";

export function FestivalBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${FESTIVAL.burgundy}55 0%, ${FESTIVAL.bg} 55%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            ${FESTIVAL.gold} 0,
            ${FESTIVAL.gold} 1px,
            transparent 1px,
            transparent 12px
          )`,
        }}
      />
      {!reduceMotion && (
        <>
          <motion.div
            className="absolute -right-24 top-20 h-64 w-64 rounded-full blur-3xl"
            style={{ background: `${FESTIVAL.gold}18` }}
            animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -left-20 bottom-32 h-56 w-56 rounded-full blur-3xl"
            style={{ background: `${FESTIVAL.burgundy}40` }}
            animate={{ opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </>
      )}
    </div>
  );
}
