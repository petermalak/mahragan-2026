"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FESTIVAL } from "@/lib/festival";
import { useIsMounted } from "@/lib/useIsMounted";

export function FestivalBackground() {
  const reduceMotion = useReducedMotion();
  const mounted = useIsMounted();
  const showMotion = mounted && !reduceMotion;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 50% -5%, rgba(232,242,250,0.9) 0%, transparent 55%),
            radial-gradient(ellipse 50% 35% at 100% 100%, rgba(255,215,0,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 0% 90%, rgba(139,26,26,0.05) 0%, transparent 45%),
            radial-gradient(ellipse 30% 25% at 80% 20%, rgba(26,61,122,0.04) 0%, transparent 40%),
            ${FESTIVAL.bg}
          `,
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-px opacity-50"
        style={{ background: FESTIVAL.goldGradient }}
      />
      {showMotion ? (
        <motion.div
          className="absolute -right-32 top-16 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "rgba(232,242,250,0.5)" }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 14, repeat: Infinity }}
        />
      ) : null}
    </div>
  );
}
