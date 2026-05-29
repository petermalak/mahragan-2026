"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "@/lib/motion";

interface AnimatedInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
}

export function AnimatedIn({
  children,
  className,
  delay = 0,
  variants = fadeUp,
}: AnimatedInProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={variants}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
