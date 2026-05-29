# قالب Google Sheet

## الطريقة السريعة (استيراد CSV)

1. أنشئ جدولاً جديداً في [Google Sheets](https://sheets.google.com).
2. **ملف → استيراد → رفع** واختر [`teams-template.csv`](teams-template.csv) من مجلد `docs`.
3. بعد الاستيراد، انقر بزر الماوس الأيمن على تبويب الورقة → **إعادة تسمية** إلى **`Teams`** (بالضبط).  
   إذا بقي الاسم `Sheet1`، إمّا أعد التسمية أو ضع في `.env`: `GOOGLE_SHEET_TAB=Sheet1`

## الطريقة اليدوية

1. أنشئ جدولاً جديداً في [Google Sheets](https://sheets.google.com).
2. سمِّ الورقة الأولى **`Teams`** (بالضبط).
3. الصف 1 = عناوين الأعمدة (انسخ السطر التالي):

```
slug	name_ar	geldr	houses	markets	land_fixed	crops	trade_volume	satisfaction	notes	updated_at
```

4. الصفوف 2–7 = بيانات الفرق الستة (مثال):

| slug | name_ar | geldr | houses | markets | land_fixed | crops | trade_volume | satisfaction | notes | updated_at |
|------|---------|-------|--------|---------|------------|-------|--------------|--------------|-------|------------|
| al-hamoul | الحامول | 1250 | 8 | 3 | 12 | 20 | 450 | | السوق نشط اليوم | |
| matoubas | مطوبس | 980 | 6 | 4 | 10 | 18 | 380 | | | |
| abo-al-matameer | أبو المطامير | 1100 | 7 | 2 | 14 | 22 | 320 | | توسعة الأراضي | |
| al-dalangat | الدلنجات | 870 | 5 | 3 | 9 | 15 | 290 | | | |
| farshout | فرشوط | 1420 | 9 | 5 | 11 | 19 | 520 | | أعلى رصيد جلدر | |
| al-tramssa | الترامسة | 1050 | 7 | 3 | 13 | 21 | 410 | | | |

> **`satisfaction`**: اتركه فارغاً ليُحسب تلقائياً، أو ضع رقماً من 0 إلى 100.

> **`updated_at`**: يمكنك استخدام `=NOW()` في كل صف أو تحديثه يدوياً.

## مشاركة الشيت

شارك الجدول مع بريد **Service Account** (`client_email` من ملف JSON) بصلاحية **Viewer**.

## معرف الجدول

من رابط الشيت:
`https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

انسخ `SPREADSHEET_ID` إلى `GOOGLE_SHEETS_ID`.
