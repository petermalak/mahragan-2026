import type { sheets_v4 } from "googleapis";
import { normalizeParticipantKey } from "./attendanceConstants";
import { buildSheetRange, getGoogleSheetsClient, usersTabName } from "./googleSheets";
import { resolveTeamSlug, teamLabelFromSlug } from "./teamResolve";
import type { TeamSlug } from "./types";

const POINTS_HEADER_ALIASES = new Set([
  "points",
  "point",
  "score",
  "scores",
  "total",
  "total_points",
  "total_score",
  "geldr",
  "نقاط",
  "جلدر",
]);

const LAST_ATTENDANCE_ALIASES = new Set([
  "last_attendance",
  "last_attended",
  "last_scan",
  "updated_at",
  "آخر_حضور",
]);

export interface UsersSheetLayout {
  tab: string;
  idCol: number;
  nameCol: number;
  classCol: number;
  teamCol: number;
  pointsCol: number;
  lastAttendanceCol: number;
}

export interface SheetParticipant {
  id: string;
  nameAr: string;
  className: string;
  teamSlug: TeamSlug | "";
  teamLabel: string;
  score: number;
  lastAttendance: string;
  rowIndex: number;
}

function colLetter(index: number): string {
  if (index < 0) return "A";
  return String.fromCharCode(65 + index);
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

/** تخطيط افتراضي: ID · name · class · Team · Score */
export function defaultUsersLayout(tab: string): UsersSheetLayout {
  return {
    tab,
    idCol: 0,
    nameCol: 1,
    classCol: 2,
    teamCol: 3,
    pointsCol: 4,
    lastAttendanceCol: -1,
  };
}

export function parseUsersHeaderRow(
  headerRow: string[],
  tab: string,
): UsersSheetLayout {
  const layout = defaultUsersLayout(tab);
  layout.classCol = -1;
  layout.teamCol = -1;
  layout.lastAttendanceCol = -1;

  headerRow.forEach((cell, index) => {
    const h = normalizeHeader(String(cell ?? ""));
    if (h === "id") layout.idCol = index;
    if (h === "name_ar" || h === "name" || h === "الاسم") layout.nameCol = index;
    if (h === "class" || h === "class_name" || h === "فصل" || h === "الفصل")
      layout.classCol = index;
    if (h === "team_slug" || h === "team" || h === "فريق") layout.teamCol = index;
    if (POINTS_HEADER_ALIASES.has(h)) layout.pointsCol = index;
    if (LAST_ATTENDANCE_ALIASES.has(h)) layout.lastAttendanceCol = index;
  });

  return layout;
}

export async function resolveUsersSheetLayout(
  sheets: sheets_v4.Sheets,
  sheetId: string,
  tabOverride?: string,
): Promise<UsersSheetLayout> {
  const tab = tabOverride ?? usersTabName();

  try {
    const headerRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: buildSheetRange(tab, "A1:Z1"),
    });
    const headerRow = (headerRes.data.values?.[0] ?? []) as string[];
    if (headerRow.length > 0) {
      return parseUsersHeaderRow(headerRow, tab);
    }
  } catch {
    /* default */
  }

  return defaultUsersLayout(tab);
}

export function usersDataRange(layout: UsersSheetLayout): string {
  const cols = [
    layout.idCol,
    layout.nameCol,
    layout.classCol,
    layout.teamCol,
    layout.pointsCol,
    layout.lastAttendanceCol,
  ].filter((c) => c >= 0);
  const maxCol = Math.max(...cols, layout.pointsCol);
  return `A2:${colLetter(maxCol)}`;
}

export function pointsCell(layout: UsersSheetLayout, rowIndex: number): string {
  return `${colLetter(layout.pointsCol)}${rowIndex}`;
}

export function lastAttendanceCell(
  layout: UsersSheetLayout,
  rowIndex: number,
): string {
  return `${colLetter(layout.lastAttendanceCol)}${rowIndex}`;
}

export function hasLastAttendanceColumn(layout: UsersSheetLayout): boolean {
  return (
    layout.lastAttendanceCol >= 0 &&
    layout.lastAttendanceCol !== layout.pointsCol
  );
}

function parseNumber(value: unknown, fallback = 0): number {
  if (value === null || value === undefined || value === "") return fallback;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

export function rowToSheetParticipant(
  row: string[],
  rowIndex: number,
  layout: UsersSheetLayout,
): SheetParticipant | null {
  const id = normalizeParticipantKey(row[layout.idCol] ?? "");
  if (!id || id.toLowerCase() === "id") return null;

  const teamRaw =
    layout.teamCol >= 0 ? (row[layout.teamCol]?.trim() ?? "") : "";
  const teamSlug = resolveTeamSlug(teamRaw);

  return {
    id,
    nameAr: row[layout.nameCol]?.trim() || id,
    className:
      layout.classCol >= 0 ? (row[layout.classCol]?.trim() ?? "") : "",
    teamSlug,
    teamLabel: teamLabelFromSlug(teamSlug, teamRaw),
    score: parseNumber(row[layout.pointsCol]),
    lastAttendance:
      layout.lastAttendanceCol >= 0
        ? (row[layout.lastAttendanceCol]?.trim() ?? "")
        : "",
    rowIndex,
  };
}

export async function readAccumulatedScore(
  sheets: sheets_v4.Sheets,
  sheetId: string,
  layout: UsersSheetLayout,
  rowIndex: number,
): Promise<number> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: buildSheetRange(layout.tab, pointsCell(layout, rowIndex)),
  });

  return parseNumber(response.data.values?.[0]?.[0]);
}

export async function listSheetTabTitles(sheetId: string): Promise<string[]> {
  const client = getGoogleSheetsClient("readonly");
  if (!client) return [];

  const meta = await client.sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: "sheets.properties.title",
  });

  return (
    meta.data.sheets
      ?.map((s) => s.properties?.title)
      .filter((t): t is string => Boolean(t)) ?? []
  );
}

export function pickUsersTab(tabs: string[]): string {
  const fromEnv = process.env.GOOGLE_USERS_TAB?.trim();
  if (fromEnv && tabs.includes(fromEnv)) return fromEnv;

  const sheetTab = process.env.GOOGLE_SHEET_TAB?.trim();
  if (sheetTab && tabs.includes(sheetTab) && /user/i.test(sheetTab)) {
    return sheetTab;
  }

  const exact = tabs.find((t) => t.toLowerCase() === "users");
  if (exact) return exact;

  const partial = tabs.find((t) => /user/i.test(t));
  if (partial) return partial;

  return fromEnv || usersTabName();
}

export async function loadAllSheetParticipants(): Promise<{
  participants: SheetParticipant[];
  layout: UsersSheetLayout | null;
  demo: boolean;
  error?: string;
}> {
  const client = getGoogleSheetsClient("readonly");
  if (!client) {
    return { participants: [], layout: null, demo: true };
  }

  try {
    let tab = usersTabName();
    let layout = await resolveUsersSheetLayout(
      client.sheets,
      client.sheetId,
      tab,
    );

    try {
      const response = await client.sheets.spreadsheets.values.get({
        spreadsheetId: client.sheetId,
        range: buildSheetRange(tab, usersDataRange(layout)),
      });
      const rows = (response.data.values ?? []) as string[][];
      const participants = rows
        .map((row, i) => rowToSheetParticipant(row, i + 2, layout))
        .filter((p): p is SheetParticipant => Boolean(p));
      return { participants, layout: { ...layout, tab }, demo: false };
    } catch {
      const tabs = await listSheetTabTitles(client.sheetId);
      tab = pickUsersTab(tabs);
      layout = await resolveUsersSheetLayout(client.sheets, client.sheetId, tab);

      const response = await client.sheets.spreadsheets.values.get({
        spreadsheetId: client.sheetId,
        range: buildSheetRange(tab, usersDataRange(layout)),
      });
      const rows = (response.data.values ?? []) as string[][];
      const participants = rows
        .map((row, i) => rowToSheetParticipant(row, i + 2, layout))
        .filter((p): p is SheetParticipant => Boolean(p));
      return { participants, layout, demo: false };
    }
  } catch (error) {
    console.error("loadAllSheetParticipants:", error);
    return {
      participants: [],
      layout: null,
      demo: true,
      error: "تعذّر قراءة تبويب users",
    };
  }
}

export function buildScoreUpdateBatch(
  layout: UsersSheetLayout,
  rowIndex: number,
  newScore: number,
  recordedAt: string,
): { range: string; values: (string | number)[][] } {
  if (hasLastAttendanceColumn(layout)) {
    return {
      range: buildSheetRange(
        layout.tab,
        `${pointsCell(layout, rowIndex)}:${lastAttendanceCell(layout, rowIndex)}`,
      ),
      values: [[newScore, recordedAt]],
    };
  }

  return {
    range: buildSheetRange(layout.tab, pointsCell(layout, rowIndex)),
    values: [[newScore]],
  };
}
