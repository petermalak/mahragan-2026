import { NextResponse } from "next/server";
import { getParticipantsLeaderboard } from "@/lib/attendance";

export async function GET() {
  const { participants, demo } = await getParticipantsLeaderboard();

  return NextResponse.json({
    demo,
    participants: participants.map((p) => ({
      id: p.id,
      nameAr: p.nameAr,
      className: p.className,
      teamSlug: p.teamSlug,
      teamLabel: p.teamLabel,
      score: p.points,
      points: p.points,
    })),
  });
}
