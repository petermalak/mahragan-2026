"use client";

import { AttendanceFlow } from "@/components/AttendanceFlow";

export function AttendanceFlowClient({ initialId }: { initialId?: string }) {
  return <AttendanceFlow initialId={initialId} />;
}
