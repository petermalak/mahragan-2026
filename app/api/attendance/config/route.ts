import { NextResponse } from "next/server";
import { ATTENDANCE_SCORES } from "@/lib/attendanceConstants";

export async function GET() {
  return NextResponse.json({
    scores: ATTENDANCE_SCORES,
  });
}
