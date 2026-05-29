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
      className="church-card p-5 text-center"
      style={{ borderColor: `${accent}44` }}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
    >
      <p className="mb-1 text-sm text-[var(--festival-ink-muted)]">
        ملاحظة المنظم
      </p>
      <p className="text-lg font-medium text-[var(--festival-ink)]">{text}</p>
    </motion.aside>
  );
}
