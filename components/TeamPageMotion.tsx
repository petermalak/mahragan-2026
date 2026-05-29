"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer, staggerItem } from "@/lib/motion";

interface TeamPageMotionProps {
  children: ReactNode;
}

export function TeamPageMotion({ children }: TeamPageMotionProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function TeamPageSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
