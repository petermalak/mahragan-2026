# مهرجان القرى 2026 — نظام عرض التسابق

موقع عرض لـ **6 فرق** يتسابقون في بناء القرى بعملة **الجلدر**، مع مؤشر رضا القرية. البيانات تُحدَّث يدوياً من **Google Sheets** ويُعرض الموقع على **Vercel**.

## الفرق

| الفريق | الرابط |
|--------|--------|
| الحامول | `/teams/al-hamoul` |
| مطوبس | `/teams/matoubas` |
| أبو المطامير | `/teams/abo-al-matameer` |
| الدلنجات | `/teams/al-dalangat` |
| فرشوط | `/teams/farshout` |
| الترامسة | `/teams/al-tramssa` |

## التشغيل محلياً

```bash
npm install
cp .env.example .env.local
# عدّل .env.local بقيم Google (أو اتركه فارغاً لبيانات تجريبية)
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

## إعداد Google Sheets

1. أنشئ مشروعاً في [Google Cloud Console](https://console.cloud.google.com).
2. فعّل **Google Sheets API**.
3. أنشئ **Service Account** وحمّل مفتاح JSON.
4. أنشئ الشيت حسب [docs/sheet-template.md](docs/sheet-template.md).
5. **مهم:** شارك الشيت مع `client_email` من المفتاح (صلاحية **Viewer** فقط).
   - بدون هذه الخطوة يظهر الخطأ: `The caller does not have permission` (403).
6. تأكد أن تبويب الورقة اسمه **`Teams`** بالضبط.
6. انسخ إلى `.env.local`:

```env
GOOGLE_SHEETS_ID=...
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> في Vercel: الصق المفتاح كسطر واحد مع `\n` الحرفية بين أسطر المفتاح.

## النشر على Vercel

1. ارفع المشروع إلى GitHub.
2. [vercel.com](https://vercel.com) → Import Project → اختر المستودع.
3. أضف المتغيرات الثلاثة في **Environment Variables**.
4. Deploy.

التحديث من الشيت يظهر على الموقع خلال ~30 ثانية (ISR).

## API

`GET /api/teams` — JSON بكل الفرق (للتصحيح).

## حساب مؤشر الرضا

إذا عمود `satisfaction` فارغ في الشيت:

```
min(100, houses×4 + markets×6 + land_fixed×3 + crops×2 + min(trade_volume/10, 25))
```

عدّل الأوزان في `lib/satisfaction.ts` إن لزم.

## التقنيات

- Next.js 16 (App Router)
- Tailwind CSS 4
- Framer Motion
- googleapis (قراءة فقط من Sheets)
