import type { SheetsWarning } from "@/lib/sheets";

interface SheetsWarningBannerProps {
  warning: SheetsWarning;
}

export function SheetsWarningBanner({ warning }: SheetsWarningBannerProps) {
  if (warning.type === "missing_env") {
    return (
      <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-100">
        يتم عرض بيانات تجريبية — أضف متغيرات Google Sheets في{" "}
        <code className="rounded bg-black/30 px-1">.env.local</code>.
      </p>
    );
  }

  if (warning.type === "tab_fallback") {
    return (
      <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/15 px-4 py-3 text-sm text-amber-100">
        <p>
          تمت القراءة من تبويب <strong>{warning.usedTab}</strong> (لم يُوجد تبويب
          باسم Teams). لتوحيد الإعداد، أعد تسمية التبويب إلى{" "}
          <strong>Teams</strong> أو أضف في <code className="rounded bg-black/30 px-1">.env</code>:
          <code className="mt-1 block break-all rounded bg-black/30 px-2 py-1 text-xs">
            GOOGLE_SHEET_TAB={warning.usedTab}
          </code>
        </p>
        <p className="mt-2 text-xs text-amber-200/70">
          التبويبات المتاحة: {warning.availableTabs.join(" · ") || "—"}
        </p>
      </div>
    );
  }

  if (warning.type === "permission_denied") {
    return (
      <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/15 px-4 py-4 text-sm text-red-100">
        <p className="mb-2 font-semibold">
          لا يمكن قراءة Google Sheet — The caller does not have permission
        </p>
        <ol className="list-inside list-decimal space-y-1 text-red-100/90">
          <li>افتح الشيت في Google Sheets.</li>
          <li>
            اضغط <strong>مشاركة (Share)</strong>.
          </li>
          <li>
            أضف هذا البريد كـ <strong>Viewer</strong>:
            <code className="mx-1 block break-all rounded bg-black/30 px-2 py-1 text-xs sm:inline">
              {warning.serviceEmail}
            </code>
          </li>
          <li>احفظ، ثم أعد تحميل الصفحة (أوقف وأعد تشغيل npm run dev).</li>
        </ol>
        <p className="mt-2 text-xs text-red-200/70">
          تأكد أيضاً أن Google Sheets API مفعّل في مشروع Google Cloud نفسه.
        </p>
      </div>
    );
  }

  return (
    <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-100">
      تعذّر قراءة الشيت — يتم عرض بيانات تجريبية. السبب: {warning.message}
    </p>
  );
}
