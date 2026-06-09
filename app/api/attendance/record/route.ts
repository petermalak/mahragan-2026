import { NextResponse } from "next/server";
import {
  isValidAttendanceScore,
  recordAttendance,
} from "@/lib/attendance";

export async function POST(request: Request) {
  let body: { id?: string; score?: number };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const id = body.id?.trim();
  const score = Number(body.score);

  if (!id) {
    return NextResponse.json({ error: "معرّف مطلوب" }, { status: 400 });
  }

  if (!isValidAttendanceScore(score)) {
    return NextResponse.json(
      { error: "اختر نقاطاً: 10 أو 20 أو 30" },
      { status: 400 },
    );
  }

  const outcome = await recordAttendance(id, score);

  if (!outcome.ok || !outcome.result) {
    return NextResponse.json(
      {
        error: outcome.error ?? "فشل التسجيل",
        needsEditor: outcome.needsEditor ?? false,
      },
      { status: outcome.needsEditor ? 403 : 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    result: {
      id: outcome.result.participant.id,
      nameAr: outcome.result.participant.nameAr,
      teamSlug: outcome.result.participant.teamSlug,
      points: outcome.result.participant.points,
      scoreAdded: outcome.result.score,
      pointsAdded: outcome.result.score,
      previousTotal: outcome.result.participant.points - outcome.result.score,
      totalPoints: outcome.result.participant.points,
      teamGeldrAdded: outcome.result.teamGeldrAdded,
      recordedAt: outcome.result.recordedAt,
      demo: outcome.result.demo,
    },
  });
}
