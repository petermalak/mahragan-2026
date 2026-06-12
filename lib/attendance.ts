import type { sheets_v4 } from "googleapis";
import type { TeamSlug } from "./types";
import {
  attendanceLogTabName,
  buildSheetRange,
  getGoogleSheetsClient,
  teamsTabName,
  usersTabName,
} from "./googleSheets";
import {
  getDemoParticipant,
  normalizeNameForMatch,
  normalizeParticipantKey,
  recordDemoAttendance,
  sheetParticipantToParticipant,
  type AttendanceRecordResult,
  type AttendanceScore,
  type Participant,
} from "./attendanceConstants";
import {
  buildScoreUpdateBatch,
  loadAllSheetParticipants,
  readAccumulatedScore,
  resolveUsersSheetLayout,
  type SheetParticipant,
} from "./usersSheet";

export type {
  AttendanceRecordResult,
  AttendanceScore,
  Participant,
} from "./attendanceConstants";

export {
  ATTENDANCE_SCORES,
  DEMO_PARTICIPANTS,
  getDemoParticipant,
  isValidAttendanceScore,
  parseParticipantIdFromQr,
  recordDemoAttendance,
} from "./attendanceConstants";

export interface BatchRecordItem {
  id: string;
  score: AttendanceScore;
}

export interface BatchRecordOutcome {
  ok: boolean;
  results: AttendanceRecordResult[];
  errors: { id: string; error: string }[];
}

function parseNumber(value: unknown, fallback = 0): number {
  if (value === null || value === undefined || value === "") return fallback;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

const PARTICIPANTS_CACHE_MS = 30_000;
let participantsCache: {
  at: number;
  participants: SheetParticipant[];
  demo: boolean;
} | null = null;

async function getSheetParticipantsForLookup(): Promise<{
  participants: SheetParticipant[];
  demo: boolean;
}> {
  const now = Date.now();
  if (
    participantsCache &&
    now - participantsCache.at < PARTICIPANTS_CACHE_MS
  ) {
    return participantsCache;
  }

  const loaded = await loadAllSheetParticipants();
  participantsCache = {
    at: now,
    participants: loaded.participants,
    demo: loaded.demo,
  };
  return participantsCache;
}

type ParticipantLookupResult =
  | { kind: "found"; participant: SheetParticipant }
  | { kind: "ambiguous"; count: number }
  | { kind: "not_found" };

function findParticipantInList(
  participants: SheetParticipant[],
  query: string,
): ParticipantLookupResult {
  const q = normalizeParticipantKey(query);
  if (!q) return { kind: "not_found" };

  const qLower = q.toLowerCase();

  const byId = participants.filter(
    (p) => normalizeParticipantKey(p.id).toLowerCase() === qLower,
  );
  if (byId.length === 1) return { kind: "found", participant: byId[0] };

  if (qLower.length >= 8 && /^[0-9a-f-]+$/i.test(qLower.replace(/-/g, ""))) {
    const compact = qLower.replace(/-/g, "");
    const byPartialId = participants.filter((p) => {
      const pid = normalizeParticipantKey(p.id).toLowerCase().replace(/-/g, "");
      return pid === compact || pid.startsWith(compact) || compact.startsWith(pid);
    });
    if (byPartialId.length === 1) {
      return { kind: "found", participant: byPartialId[0] };
    }
  }

  const nameNorm = normalizeNameForMatch(q);
  const byName = participants.filter(
    (p) => normalizeNameForMatch(p.nameAr) === nameNorm,
  );
  if (byName.length === 1) return { kind: "found", participant: byName[0] };
  if (byName.length > 1) return { kind: "ambiguous", count: byName.length };

  return { kind: "not_found" };
}

/** One row per ID — keeps highest score if the sheet has duplicates. */
function dedupeParticipantsById(participants: Participant[]): Participant[] {
  const byId = new Map<string, Participant>();
  for (const p of participants) {
    const key = p.id.toLowerCase();
    const existing = byId.get(key);
    if (!existing || p.points > existing.points) {
      byId.set(key, p);
    }
  }
  return Array.from(byId.values());
}

function sortByPointsDesc(participants: Participant[]): Participant[] {
  return [...participants].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return a.nameAr.localeCompare(b.nameAr, "ar");
  });
}

export async function getParticipantsLeaderboard(): Promise<{
  participants: Participant[];
  demo: boolean;
}> {
  const { participants: rows, demo } = await loadAllSheetParticipants();
  if (demo || rows.length === 0) {
    const demos = sortByPointsDesc(
      [getDemoParticipant("demo-001"), getDemoParticipant("demo-002")].filter(
        (p): p is Participant => Boolean(p),
      ),
    );
    return { participants: demos, demo: true };
  }

  const sorted = sortByPointsDesc(
    dedupeParticipantsById(rows.map(sheetParticipantToParticipant)),
  );

  return { participants: sorted, demo: false };
}

export async function lookupParticipant(id: string): Promise<{
  participant: Participant | null;
  demo: boolean;
  error?: string;
}> {
  const normalized = normalizeParticipantKey(id);
  if (!normalized) {
    return { participant: null, demo: false, error: "معرّف فارغ" };
  }

  const client = getGoogleSheetsClient("readonly");
  if (!client) {
    const demo = getDemoParticipant(normalized);
    return { participant: demo, demo: true };
  }

  try {
    const { participants } = await getSheetParticipantsForLookup();
    const found = findParticipantInList(participants, normalized);
    if (found.kind === "found") {
      return {
        participant: sheetParticipantToParticipant(found.participant),
        demo: false,
      };
    }
    if (found.kind === "ambiguous") {
      return {
        participant: null,
        demo: false,
        error: `يوجد ${found.count} مشاركين بهذا الاسم — اختر بالاسم من القائمة`,
      };
    }
    return {
      participant: null,
      demo: false,
      error: "لم يُعثر على المعرّف أو الاسم في الشيت",
    };
  } catch (error) {
    console.error("lookupParticipant:", error);
    const demo = getDemoParticipant(normalized);
    if (demo) return { participant: demo, demo: true };
    return {
      participant: null,
      demo: false,
      error: "تعذّر قراءة الشيت",
    };
  }
}

export async function recordAttendance(
  id: string,
  score: AttendanceScore,
): Promise<{
  ok: boolean;
  result?: AttendanceRecordResult;
  error?: string;
  needsEditor?: boolean;
}> {
  const normalized = id.trim();
  if (!normalized) {
    return { ok: false, error: "معرّف فارغ" };
  }

  const lookup = await lookupParticipant(normalized);
  if (!lookup.participant) {
    return { ok: false, error: lookup.error ?? "لم يُعثر على المشارك" };
  }

  if (lookup.demo) {
    const result = recordDemoAttendance(normalized, score);
    if (!result) return { ok: false, error: "لم يُعثر على المشارك" };
    return { ok: true, result };
  }

  const client = getGoogleSheetsClient("readwrite");
  if (!client) {
    return { ok: false, error: "إعدادات Google Sheets غير مكتملة" };
  }

  const participant = lookup.participant;
  const recordedAt = new Date().toISOString();

  try {
    const tab = usersTabName();
    const layout = await resolveUsersSheetLayout(
      client.sheets,
      client.sheetId,
      tab,
    );

    const currentScore = await readAccumulatedScore(
      client.sheets,
      client.sheetId,
      layout,
      participant.rowIndex,
    );
    const previousScore = currentScore || participant.points;
    const newTotalScore = previousScore + score;

    const update = buildScoreUpdateBatch(
      layout,
      participant.rowIndex,
      newTotalScore,
      recordedAt,
    );

    await client.sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: client.sheetId,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: [{ range: update.range, values: update.values }],
      },
    });

    let teamGeldrAdded = 0;
    if (participant.teamSlug) {
      teamGeldrAdded = await addTeamGeldr(
        client.sheets,
        client.sheetId,
        participant.teamSlug,
        score,
      );
    }

    await appendAttendanceLog(client.sheets, client.sheetId, {
      id: participant.id,
      nameAr: participant.nameAr,
      className: participant.className,
      teamLabel: participant.teamLabel || participant.teamSlug,
      score,
      recordedAt,
    });

    return {
      ok: true,
      result: {
        participant: {
          ...participant,
          points: newTotalScore,
          lastAttendance: recordedAt,
        },
        score,
        teamGeldrAdded,
        recordedAt,
        demo: false,
      },
    };
  } catch (error) {
    console.error("recordAttendance:", error);
    const status =
      (error as { status?: number })?.status ??
      (error as { code?: number })?.code;
    if (status === 403) {
      return {
        ok: false,
        needsEditor: true,
        error:
          "لا توجد صلاحية كتابة — شارك الشيت مع حساب الخدمة كـ Editor",
      };
    }
    return { ok: false, error: "تعذّر تسجيل الحضور" };
  }
}

export async function recordAttendanceBatch(
  records: BatchRecordItem[],
): Promise<BatchRecordOutcome & { needsEditor?: boolean }> {
  const results: AttendanceRecordResult[] = [];
  const errors: { id: string; error: string }[] = [];
  let needsEditor = false;

  for (const { id, score } of records) {
    const outcome = await recordAttendance(id, score);
    if (outcome.ok && outcome.result) {
      results.push(outcome.result);
    } else {
      errors.push({ id, error: outcome.error ?? "فشل التسجيل" });
      if (outcome.needsEditor) needsEditor = true;
    }
  }

  return {
    ok: errors.length === 0,
    results,
    errors,
    ...(needsEditor ? { needsEditor: true } : {}),
  };
}

async function addTeamGeldr(
  sheets: sheets_v4.Sheets,
  sheetId: string,
  teamSlug: TeamSlug,
  score: number,
): Promise<number> {
  const tab = teamsTabName();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: buildSheetRange(tab, "A2:C"),
  });

  const rows = (response.data.values ?? []) as string[][];
  for (let i = 0; i < rows.length; i++) {
    const slug = String(rows[i][0] ?? "").trim().toLowerCase();
    if (slug !== teamSlug) continue;

    const currentGeldr = parseNumber(rows[i][2]);
    const newGeldr = currentGeldr + score;
    const rowIndex = i + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: buildSheetRange(tab, `C${rowIndex}`),
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[newGeldr]] },
    });

    return score;
  }

  return 0;
}

async function appendAttendanceLog(
  sheets: sheets_v4.Sheets,
  sheetId: string,
  entry: {
    id: string;
    nameAr: string;
    className: string;
    teamLabel: string;
    score: number;
    recordedAt: string;
  },
) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: buildSheetRange(attendanceLogTabName(), "A:F"),
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          entry.id,
          entry.nameAr,
          entry.className,
          entry.teamLabel,
          entry.score,
          entry.recordedAt,
        ],
      ],
    },
  });
}
