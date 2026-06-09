# تسجيل الحضور بـ QR Code

## تبويب users (المشاركون)

الأعمدة المتوقعة (كما في شيتك):

```
ID	name	class	Team	Score
17f121f3-...	ابونا شاروبيم	فصل اولى ثانوى بنات		0
```

| العمود | الوصف |
|--------|--------|
| **ID** | UUID أو أي معرّف فريد — يُوضَع داخل QR |
| **name** | اسم المشارك |
| **class** | الفصل / المجموعة |
| **Team** | slug الفريق (`al-hamoul`) أو الاسم العربي — يمكن تركه فارغاً |
| **Score** | **إجمالي متراكم** — يُحدَّث تلقائياً عند كل حضور |

> يمكن أيضاً استخدام: `points` بدل `Score`، أو `team_slug` بدل `Team`.

## تبويبات أخرى

| التبويب | المتغير |
|---------|---------|
| **Teams** | `GOOGLE_TEAMS_TAB` |
| **Attendance** | `GOOGLE_ATTENDANCE_TAB` (سجل تلقائي) |

سجل Attendance:

```
id	name	class	team	score	recorded_at
```

## `.env`

```env
GOOGLE_USERS_TAB=users
GOOGLE_TEAMS_TAB=Teams
GOOGLE_ATTENDANCE_TAB=Attendance
NEXT_PUBLIC_APP_URL=https://your-site.vercel.app
```

**صلاحيات:** Service Account = **Editor** على الشيت.

## الروابط

| الصفحة | الرابط |
|--------|--------|
| مسح الحضور | `/attendance` |
| ترتيب المشاركين | `/scores` |

## آلية العمل

1. امسح QR أو أدخل المعرّف — يُضاف للقائمة (الكamera تبقى مفتوحة)
2. لكل مشارك اختر **10** أو **20** أو **30**
3. اضغط **حفظ الكل** — تُسجَّل كل السجلات دفعة واحدة
4. **Score** في users = القديم + الجديد (لكل سجل)
5. إذا **Team** معبّأ → يُضاف نفس الرقم لجلدر الفريق
6. يُسجَّل سطر في **Attendance** لكل مشارك
