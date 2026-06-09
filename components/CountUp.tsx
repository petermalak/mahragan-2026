"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface CountUpProps {
  value: number;
  className?: string;
}

export function CountUp({ value, className }: CountUpProps) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    setDisplay(0);
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, reduceMotion]);

  return (
    <span className={className}>{display.toLocaleString("ar-EG")}</span>
  );
}
