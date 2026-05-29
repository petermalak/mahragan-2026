/** مهرجان الكرازة — ألوان مستوحاة من شعار المهرجان وشعار الكنيسة */
export const FESTIVAL = {
  nameAr: "مهرجان الكرازة المرقسية",
  churchNameEn: "Saint Demiana Coptic Orthodox Church",
  tagline: "«يعظم انتصارنا بالذي أحبنا»",
  taglineRef: "رومية ٨ : ٣٧",
  yearGregorian: "٢٠٢٦ م",
  yearCoptic: "١٧٤٢ ش",
  currency: "جلدر",

  /* أساس فاتح — كريم شعار القديسة دمiana */
  bg: "#fef9e7",
  bgElevated: "#ffffff",
  surface: "#f5f0dc",
  border: "#e8dcc4",

  /* ألوان الشعارين */
  royalBlue: "#1a3d7a",
  royalBlueLight: "#2a5a9e",
  maroon: "#8b1a1a",
  maroonDeep: "#6b1414",
  gold: "#d4af37",
  goldBright: "#ffd700",
  goldMuted: "#b8922a",
  cream: "#fef9e7",
  ivory: "#fffdf8",
  skyBlue: "#e8f2fa",
  scriptureRed: "#a31818",
  purple: "#4b2c5e",
  ink: "#2a2420",
  inkMuted: "#5c5348",

  /* توافق مع الأسماء القديمة */
  wine: "#8b1a1a",
  wineDeep: "#6b1414",
  burgundy: "#8b1a1a",
  goldLight: "#b8922a",
  sage: "#4a6b4e",
  amber: "#b8860b",
  slate: "#1a3d7a",

  /* تدرجات */
  heroGradient:
    "linear-gradient(160deg, #e8f2fa 0%, #fef9e7 45%, #f5f0dc 100%)",
  goldGradient: "linear-gradient(135deg, #ffd700 0%, #d4af37 50%, #b8922a 100%)",
  blueGradient: "linear-gradient(135deg, #1a3d7a 0%, #2a5a9e 100%)",
  cardShine:
    "linear-gradient(180deg, rgba(255,215,0,0.12) 0%, rgba(232,242,250,0.4) 100%)",
} as const;

export const LOGOS = {
  church: "/logos/church-logo.png",
  mahragan: "/logos/mahragan-logo.png",
  churchAlt: "Saint Demiana Coptic Orthodox Church",
  mahraganAlt: "مهرجان الكرازة المرقسية",
} as const;

export const SATISFACTION_TIERS = [
  { min: 88, label: "جداً سعيد", pct: 100, color: "#b8922a" },
  { min: 63, label: "سعيد", pct: 75, color: "#4a6b4e" },
  { min: 38, label: "جداً راضي", pct: 50, color: "#1a3d7a" },
  { min: 13, label: "راضي", pct: 25, color: "#8b6b5c" },
] as const;

export const SCORING_BONUS = {
  title: "نقاط إضافية",
  items: ["حضور الفريق", "النشاط في مسابقات المهرجان"],
} as const;

export const TRADE_RULES = {
  title: "نظام البيع والشراء بين الفرق",
  summary:
    "الفريق الذي ينتظر يبيع للفريق الذي يريد — والإقناع أمام اللجنة يحدد الكسب.",
} as const;

/** ألوان المراحل — أزرق ملكي · ذهب · عنابي · أخضر */
export const PHASE_COLORS = [
  "#1a3d7a",
  "#d4af37",
  "#8b1a1a",
  "#4a6b4e",
] as const;
