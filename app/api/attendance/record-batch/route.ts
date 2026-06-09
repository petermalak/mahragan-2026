import { NextResponse } from "next/server";
import {
  isValidAttendanceScore,
  recordAttendanceBatch,
  type BatchRecordItem,
} from "@/lib/attendance";

export async function POST(request: Request) {
  let body: { records?: { id?: string; score?: number }[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const raw = body.records;
  if (!Array.isArray(raw) || raw.length === 0) {
    return NextResponse.json(
      { error: "أضف مشاركاً واحداً على الأقل" },
      { status: 400 },
    );
  }

  const records: BatchRecordItem[] = [];
  for (const item of raw) {
    const id = item.id?.trim();
    const score = Number(item.score);
    if (!id) {
      return NextResponse.json({ error: "معرّف مطلوب" }, { status: 400 });
    }
    if (!isValidAttendanceScore(score)) {
      return NextResponse.json(
        { error: "النقاط يجب أن تكون 10 أو 20 أو 30" },
        { status: 400 },
      );
    }
    records.push({ id, score });
  }

  const outcome = await recordAttendanceBatch(records);

  if (outcome.results.length === 0) {
    return NextResponse.json(
      {
        error: outcome.errors[0]?.error ?? "فشل التسجيل",
        needsEditor: outcome.needsEditor ?? false,
        errors: outcome.errors,
      },
      { status: outcome.needsEditor ? 403 : 500 },
    );
  }

  return NextResponse.json({
    ok: outcome.ok,
    saved: outcome.results.length,
    failed: outcome.errors.length,
    results: outcome.results.map((r) => ({
      id: r.participant.id,
      nameAr: r.participant.nameAr,
      scoreAdded: r.score,
      totalPoints: r.participant.points,
      teamGeldrAdded: r.teamGeldrAdded,
      demo: r.demo,
    })),
    errors: outcome.errors,
    needsEditor: outcome.needsEditor ?? false,
  });
}
