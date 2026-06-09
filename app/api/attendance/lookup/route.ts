import { NextResponse } from "next/server";
import { lookupParticipant } from "@/lib/attendance";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();

  if (!id) {
    return NextResponse.json({ error: "معرّف مطلوب" }, { status: 400 });
  }

  const { participant, demo, error } = await lookupParticipant(id);

  if (!participant) {
    return NextResponse.json({ error: error ?? "غير موجود" }, { status: 404 });
  }

  return NextResponse.json({
      participant: {
        id: participant.id,
        nameAr: participant.nameAr,
        className: participant.className,
        teamSlug: participant.teamSlug,
        teamLabel: participant.teamLabel,
        points: participant.points,
        totalPoints: participant.points,
        lastAttendance: participant.lastAttendance,
      },
    demo,
  });
}
