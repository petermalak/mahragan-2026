import { NextResponse } from "next/server";
import { getAllTeamsEnriched, REVALIDATE_SECONDS } from "@/lib/sheets";

export async function GET() {
  try {
    const { teams, warning } = await getAllTeamsEnriched();
    return NextResponse.json({
      teams,
      warning,
      revalidateSeconds: REVALIDATE_SECONDS,
      source: warning ? "demo-fallback" : "google-sheets",
    });
  } catch (error) {
    console.error("API /teams error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 },
    );
  }
}
