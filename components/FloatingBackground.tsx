"use client";

import { motion, useReducedMotion } from "framer-motion";

interface FloatingBackgroundProps {
  accent?: string;
}

export function FloatingBackground({ accent = "#14b8a6" }: FloatingBackgroundProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 30% 10%, ${accent}33, transparent 55%)`,
        }}
      />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className="absolute -right-20 top-0 h-72 w-72 rounded-full blur-3xl"
        style={{ background: `${accent}40` }}
        animate={{
          x: [0, -40, 20, 0],
          y: [0, 30, -20, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-16 top-1/3 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 25, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 h-56 w-96 -translate-x-1/2 rounded-full bg-teal-500/15 blur-3xl"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {[...Array(6)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/30"
          style={{
            left: `${12 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
