"use client";

import { motion, useReducedMotion } from "framer-motion";

interface OrganizerNoteProps {
  text: string;
  accent: string;
}

export function OrganizerNote({ text, accent }: OrganizerNoteProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.aside
      className="rounded-2xl border border-white/15 bg-black/30 p-5 text-center backdrop-blur-md"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
    >
      <motion.p
        className="mb-1 text-sm text-white/60"
        animate={reduceMotion ? {} : { opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ملاحظة المنظم
      </motion.p>
      <motion.p
        className="text-lg font-medium text-white"
        initial={reduceMotion ? false : { scale: 0.95 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        style={{ textShadow: `0 0 20px ${accent}44` }}
      >
        {text}
      </motion.p>
    </motion.aside>
  );
}
