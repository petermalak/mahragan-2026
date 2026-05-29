/** مهرجان الكرازة — ألوان ونصوص العرض المعتمد */
export const FESTIVAL = {
  nameAr: "مهرجان الكرازة القبطي الأرثوذكسي",
  tagline: "«احبنا بالذي انتصرنا يعظم»",
  currency: "جلدر",
  bg: "#1a0f18",
  burgundy: "#6b1d3a",
  maroon: "#3d0f28",
  gold: "#d4af37",
  goldLight: "#f0d78c",
  cream: "#f5e6c8",
} as const;

export const SATISFACTION_TIERS = [
  { min: 88, label: "جداً سعيد", pct: 100, emoji: "😄" },
  { min: 63, label: "سعيد", pct: 75, emoji: "🙂" },
  { min: 38, label: "جداً راضي", pct: 50, emoji: "😐" },
  { min: 13, label: "راضي", pct: 25, emoji: "🙂" },
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
