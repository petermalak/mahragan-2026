"use client";

import { useEffect, useState } from "react";

/** Avoid SSR/client mismatch before hydration completes. */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
