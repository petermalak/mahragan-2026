import { google } from "googleapis";
import { resolveSatisfaction } from "./satisfaction";
import { TEAM_SLUGS, TEAM_THEMES, isTeamSlug } from "./teams";
import type { TeamSlug, TeamState, TeamWithMax } from "./types";

export const REVALIDATE_SECONDS = 30;

const DATA_RANGE = "A2:K7";
const PREFERRED_TAB = "Teams";

const HEADERS = [
  "slug",
  "name_ar",
  "geldr",
  "houses",
  "markets",
  "land_fixed",
  "crops",
  "trade_volume",
  "satisfaction",
  "notes",
  "updated_at",
] as const;

function parseNumber(value: unknown, fallback = 0): number {
  if (value === null || value === undefined || value === "") return fallback;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

function parseOptionalSatisfaction(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function rowToTeamState(row: string[]): TeamState | null {
  const padded = [...row];
  while (padded.length < HEADERS.length) padded.push("");

  const slugRaw = padded[0]?.trim();
  if (!slugRaw || !isTeamSlug(slugRaw)) return null;

  const slug = slugRaw as TeamSlug;
  const theme = TEAM_THEMES[slug];
  const houses = parseNumber(padded[3]);
  const markets = parseNumber(padded[4]);
  const landFixed = parseNumber(padded[5]);
  const crops = parseNumber(padded[6]);
  const tradeVolume = parseNumber(padded[7]);
  const manualSatisfaction = parseOptionalSatisfaction(padded[8]);

  return {
    slug,
    nameAr: padded[1]?.trim() || theme.nameAr,
    geldr: parseNumber(padded[2]),
    houses,
    markets,
    landFixed,
    crops,
    tradeVolume,
    satisfaction: resolveSatisfaction(manualSatisfaction, {
      houses,
      markets,
      landFixed,
      crops,
      tradeVolume,
    }),
    notes: padded[9]?.trim() ?? "",
    updatedAt: padded[10]?.trim() || new Date().toISOString(),
  };
}

function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEETS_ID;

  if (!email || !privateKey || !sheetId) {
    return null;
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return { sheets: google.sheets({ version: "v4", auth }), sheetId };
}

/** A1 notation: quote tab names so Sheets accepts any title (spaces, Arabic, etc.). */
function buildRange(tabTitle: string, cellRange = DATA_RANGE): string {
  const escaped = tabTitle.replace(/'/g, "''");
  return `'${escaped}'!${cellRange}`;
}

async function listSheetTabs(
  client: NonNullable<ReturnType<typeof getSheetsClient>>,
): Promise<string[]> {
  const meta = await client.sheets.spreadsheets.get({
    spreadsheetId: client.sheetId,
    fields: "sheets.properties.title",
  });
  return (
    meta.data.sheets
      ?.map((s) => s.properties?.title)
      .filter((t): t is string => Boolean(t)) ?? []
  );
}

function pickSheetTab(tabs: string[]): string {
  const fromEnv = process.env.GOOGLE_SHEET_TAB?.trim();

  if (fromEnv && tabs.includes(fromEnv)) return fromEnv;
  if (tabs.includes(PREFERRED_TAB)) return PREFERRED_TAB;

  const teamsLike = tabs.find(
    (t) => t.toLowerCase() === "teams" || t.toLowerCase().includes("team"),
  );
  if (teamsLike) return teamsLike;

  if (tabs[0]) return tabs[0];

  return fromEnv || PREFERRED_TAB;
}

export function getDemoTeams(): TeamState[] {
  const demos: Omit<TeamState, "satisfaction">[] = [
    {
      slug: "al-hamoul",
      nameAr: "الحامول",
      geldr: 1250,
      houses: 8,
      markets: 3,
      landFixed: 12,
      crops: 20,
      tradeVolume: 450,
      notes: "السوق نشط اليوم",
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "matoubas",
      nameAr: "مطوبس",
      geldr: 980,
      houses: 6,
      markets: 4,
      landFixed: 10,
      crops: 18,
      tradeVolume: 380,
      notes: "",
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "abo-al-matameer",
      nameAr: "أبو المطامير",
      geldr: 1100,
      houses: 7,
      markets: 2,
      landFixed: 14,
      crops: 22,
      tradeVolume: 320,
      notes: "توسعة الأراضي الزراعية",
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "al-dalangat",
      nameAr: "الدلنجات",
      geldr: 870,
      houses: 5,
      markets: 3,
      landFixed: 9,
      crops: 15,
      tradeVolume: 290,
      notes: "",
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "farshout",
      nameAr: "فرشوط",
      geldr: 1420,
      houses: 9,
      markets: 5,
      landFixed: 11,
      crops: 19,
      tradeVolume: 520,
      notes: "أعلى رصيد جلدر",
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "al-tramssa",
      nameAr: "الترامسة",
      geldr: 1050,
      houses: 7,
      markets: 3,
      landFixed: 13,
      crops: 21,
      tradeVolume: 410,
      notes: "",
      updatedAt: new Date().toISOString(),
    },
  ];

  return demos.map((d) => ({
    ...d,
    satisfaction: resolveSatisfaction(null, {
      houses: d.houses,
      markets: d.markets,
      landFixed: d.landFixed,
      crops: d.crops,
      tradeVolume: d.tradeVolume,
    }),
  }));
}

export type SheetsWarning =
  | { type: "missing_env" }
  | { type: "permission_denied"; serviceEmail: string }
  | { type: "tab_fallback"; usedTab: string; availableTabs: string[] }
  | { type: "unknown"; message: string };

export interface TeamsFetchResult {
  teams: TeamState[];
  warning: SheetsWarning | null;
}

function parseSheetsError(
  error: unknown,
  serviceEmail: string,
): SheetsWarning {
  const status =
    (error as { status?: number })?.status ??
    (error as { code?: number })?.code;
  const message =
    (error as { message?: string })?.message ??
    (error as { cause?: { message?: string } })?.cause?.message ??
    "Unknown error";

  if (status === 403) {
    return { type: "permission_denied", serviceEmail };
  }

  if (message.includes("Unable to parse range")) {
    return {
      type: "unknown",
      message:
        "تبويب الورقة غير موجود. أعد تسمية التبويب إلى Teams أو عيّن GOOGLE_SHEET_TAB في .env",
    };
  }

  return { type: "unknown", message };
}

function rowsToTeams(rows: string[][]): TeamState[] {
  const teams: TeamState[] = [];
  for (const row of rows) {
    const first = String(row[0] ?? "").trim().toLowerCase();
    if (first === "slug") continue;
    const team = rowToTeamState(row);
    if (team) teams.push(team);
  }
  return teams;
}

export async function getTeamsFromSheet(): Promise<TeamsFetchResult> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const client = getSheetsClient();

  if (!client) {
    return { teams: getDemoTeams(), warning: { type: "missing_env" } };
  }

  try {
    const envTab = process.env.GOOGLE_SHEET_TAB?.trim();
    const preferred = envTab || PREFERRED_TAB;

    // One metadata request only when tab name is not fixed in .env
    const availableTabs = envTab ? [] : await listSheetTabs(client);
    const tabTitle = envTab ?? pickSheetTab(availableTabs);
    const usedFallback =
      !envTab &&
      tabTitle !== preferred &&
      availableTabs.length > 0 &&
      !availableTabs.includes(preferred);

    const response = await client.sheets.spreadsheets.values.get({
      spreadsheetId: client.sheetId,
      range: buildRange(tabTitle),
    });

    const rows = (response.data.values ?? []) as string[][];
    const teams = rowsToTeams(rows);

    if (teams.length === 0) {
      return {
        teams: getDemoTeams(),
        warning: {
          type: "unknown",
          message:
            "لا توجد صفوف صالحة. تأكد من عمود slug والصفوف 2–7 (أو أعد تسمية التبويب إلى Teams).",
        },
      };
    }

    const bySlug = new Map(teams.map((t) => [t.slug, t]));
    const merged = TEAM_SLUGS.map(
      (slug) => bySlug.get(slug) ?? getDemoTeams().find((t) => t.slug === slug)!,
    );

    const warning: SheetsWarning | null = usedFallback
      ? { type: "tab_fallback", usedTab: tabTitle, availableTabs }
      : null;

    return { teams: merged, warning };
  } catch (error) {
    console.error("Failed to fetch Google Sheet:", error);
    return {
      teams: getDemoTeams(),
      warning: parseSheetsError(error, email ?? ""),
    };
  }
}

export function enrichTeamsWithMax(teams: TeamState[]): TeamWithMax[] {
  const maxGeldr = Math.max(...teams.map((t) => t.geldr), 1);
  const maxHouses = Math.max(...teams.map((t) => t.houses), 1);
  const maxMarkets = Math.max(...teams.map((t) => t.markets), 1);
  const maxLandFixed = Math.max(...teams.map((t) => t.landFixed), 1);
  const maxCrops = Math.max(...teams.map((t) => t.crops), 1);
  const maxTradeVolume = Math.max(...teams.map((t) => t.tradeVolume), 1);

  return teams.map((t) => ({
    ...t,
    maxGeldr,
    maxHouses,
    maxMarkets,
    maxLandFixed,
    maxCrops,
    maxTradeVolume,
  }));
}

export async function getTeamBySlug(
  slug: TeamSlug,
): Promise<{ team: TeamWithMax | null; warning: SheetsWarning | null }> {
  const { teams, warning } = await getTeamsFromSheet();
  const enriched = enrichTeamsWithMax(teams);
  return {
    team: enriched.find((t) => t.slug === slug) ?? null,
    warning,
  };
}

export async function getAllTeamsEnriched(): Promise<{
  teams: TeamWithMax[];
  warning: SheetsWarning | null;
}> {
  const { teams, warning } = await getTeamsFromSheet();
  return { teams: enrichTeamsWithMax(teams), warning };
}
