import type { TeamSlug } from "./types";

export const ATTENDANCE_SCORES = [10, 20, 30] as const;
export type AttendanceScore = (typeof ATTENDANCE_SCORES)[number];

/** مشارك — متوافق مع شيت users: ID · name · class · Team · Score */
export interface Participant {
  id: string;
  nameAr: string;
  className: string;
  teamSlug: TeamSlug | "";
  teamLabel: string;
  points: number;
  lastAttendance: string;
  rowIndex: number;
}

export interface AttendanceRecordResult {
  participant: Participant;
  score: AttendanceScore;
  teamGeldrAdded: number;
  recordedAt: string;
  demo: boolean;
}

export const DEMO_PARTICIPANTS: Omit<Participant, "rowIndex">[] = [
  {
    id: "demo-001",
    nameAr: "مشارك تجريبي — الحامول",
    className: "فصل تجريبي",
    teamSlug: "al-hamoul",
    teamLabel: "الحامول",
    points: 0,
    lastAttendance: "",
  },
  {
    id: "demo-002",
    nameAr: "مشارك تجريبي — مطوبس",
    className: "فصل تجريبي",
    teamSlug: "matoubas",
    teamLabel: "مطوبس",
    points: 120,
    lastAttendance: "",
  },
];

export function sheetParticipantToParticipant(
  p: import("./usersSheet").SheetParticipant,
): Participant {
  return {
    id: p.id,
    nameAr: p.nameAr,
    className: p.className,
    teamSlug: p.teamSlug,
    teamLabel: p.teamLabel,
    points: p.score,
    lastAttendance: p.lastAttendance,
    rowIndex: p.rowIndex,
  };
}

/** Strip invisible chars often copied from Sheets or QR payloads. */
export function normalizeParticipantKey(value: string): string {
  return value
    .trim()
    .replace(/^\ufeff/, "")
    .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, "")
    .replace(/\s+/g, " ");
}

export function normalizeNameForMatch(value: string): string {
  return normalizeParticipantKey(value).replace(/\s+/g, " ").trim();
}

export function parseParticipantIdFromQr(raw: string): string {
  const trimmed = normalizeParticipantKey(raw);
  if (!trimmed) return "";

  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const url = new URL(trimmed);
      const fromQuery =
        url.searchParams.get("id") ??
        url.searchParams.get("ID") ??
        url.pathname.split("/").filter(Boolean).pop();
      if (fromQuery) return normalizeParticipantKey(fromQuery);
    }
  } catch {
    /* not a URL */
  }

  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as { id?: string; ID?: string };
      return normalizeParticipantKey(parsed.id ?? parsed.ID ?? "");
    } catch {
      /* ignore */
    }
  }

  return trimmed;
}

export function isValidAttendanceScore(value: number): value is AttendanceScore {
  return (ATTENDANCE_SCORES as readonly number[]).includes(value);
}

export function getDemoParticipant(id: string): Participant | null {
  const found = DEMO_PARTICIPANTS.find(
    (p) => p.id.toLowerCase() === id.toLowerCase(),
  );
  if (!found) return null;
  return { ...found, rowIndex: -1 };
}

export function recordDemoAttendance(
  id: string,
  score: AttendanceScore,
): AttendanceRecordResult | null {
  const participant = getDemoParticipant(id);
  if (!participant) return null;

  const recordedAt = new Date().toISOString();
  return {
    participant: {
      ...participant,
      points: participant.points + score,
      lastAttendance: recordedAt,
    },
    score,
    teamGeldrAdded: participant.teamSlug ? score : 0,
    recordedAt,
    demo: true,
  };
}
