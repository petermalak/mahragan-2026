import { google } from "googleapis";

export type SheetsAccess = "readonly" | "readwrite";

export function getGoogleSheetsClient(access: SheetsAccess = "readonly") {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEETS_ID;

  if (!email || !privateKey || !sheetId) {
    return null;
  }

  const scope =
    access === "readwrite"
      ? "https://www.googleapis.com/auth/spreadsheets"
      : "https://www.googleapis.com/auth/spreadsheets.readonly";

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: [scope],
  });

  return { sheets: google.sheets({ version: "v4", auth }), sheetId, email };
}

/** A1 notation with quoted tab name. */
export function buildSheetRange(tabTitle: string, cellRange: string): string {
  const escaped = tabTitle.replace(/'/g, "''");
  return `'${escaped}'!${cellRange}`;
}

export function usersTabName(): string {
  const fromEnv = process.env.GOOGLE_USERS_TAB?.trim();
  if (fromEnv) return fromEnv;

  const sheetTab = process.env.GOOGLE_SHEET_TAB?.trim();
  if (sheetTab && /user/i.test(sheetTab)) return sheetTab;

  return "Users";
}

export function teamsTabName(): string {
  const fromTeams = process.env.GOOGLE_TEAMS_TAB?.trim();
  if (fromTeams) return fromTeams;

  const sheetTab = process.env.GOOGLE_SHEET_TAB?.trim();
  if (sheetTab && /team/i.test(sheetTab)) return sheetTab;

  return "Teams";
}

export function attendanceLogTabName(): string {
  return process.env.GOOGLE_ATTENDANCE_TAB?.trim() || "Attendance";
}
