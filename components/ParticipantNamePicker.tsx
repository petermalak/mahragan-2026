"use client";

import { useEffect, useMemo, useState } from "react";

export interface PickableParticipant {
  id: string;
  nameAr: string;
  className: string;
  teamLabel: string;
  points: number;
}

interface ParticipantNamePickerProps {
  onSelect: (participant: PickableParticipant, isDemo: boolean) => void;
  disabled?: boolean;
  onDemoChange?: (demo: boolean) => void;
}

export function ParticipantNamePicker({
  onSelect,
  disabled = false,
  onDemoChange,
}: ParticipantNamePickerProps) {
  const [participants, setParticipants] = useState<PickableParticipant[]>([]);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/attendance/participants")
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        const raw = (data.participants ?? []).map(
          (p: PickableParticipant & { score?: number }) => ({
            id: p.id,
            nameAr: p.nameAr,
            className: p.className ?? "",
            teamLabel: p.teamLabel ?? "",
            points: p.score ?? p.points ?? 0,
          }),
        );
        const byId = new Map<string, PickableParticipant>();
        for (const p of raw) {
          const key = p.id.toLowerCase();
          const existing = byId.get(key);
          if (!existing || p.points > existing.points) byId.set(key, p);
        }
        setParticipants(
          Array.from(byId.values()).sort((a, b) =>
            a.nameAr.localeCompare(b.nameAr, "ar"),
          ),
        );
        const isDemo = Boolean(data.demo);
        setDemo(isDemo);
        onDemoChange?.(isDemo);
      })
      .catch(() => {
        if (active) setLoadError("تعذّر تحميل الأسماء — تحقق من الإنترنت");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [onDemoChange]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return participants;
    return participants.filter((p) => {
      const haystack = [p.nameAr, p.className, p.teamLabel, p.id]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [participants, query]);

  if (loading) {
    return (
      <p className="py-8 text-center text-lg text-[var(--festival-ink-muted)]">
        جاري تحميل الأسماء…
      </p>
    );
  }

  if (loadError) {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-lg text-[var(--festival-scripture-red)]">
        {loadError}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {demo ? (
        <p className="rounded-xl bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
          أسماء تجريبية — لن تُحفظ في الشيت
        </p>
      ) : null}

      <label className="block">
        <span className="mb-2 block text-base font-semibold text-royal">
          ابحث بالاسم أو الفصل
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled}
          placeholder="اكتب اسم المشارك…"
          className="min-h-14 w-full rounded-xl border border-[var(--festival-border)] bg-white px-4 text-lg"
          autoComplete="off"
        />
      </label>

      <p className="text-sm text-[var(--festival-ink-muted)]">
        {filtered.length} من {participants.length} مشارك
      </p>

      <ul className="max-h-[min(420px,50vh)] space-y-2 overflow-y-auto overscroll-contain pr-1">
        {filtered.length === 0 ? (
          <li className="py-6 text-center text-base text-[var(--festival-ink-muted)]">
            لا توجد نتائج — جرّب كلمة أخرى
          </li>
        ) : (
          filtered.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(p, demo)}
                className="flex w-full min-h-14 items-center justify-between gap-3 rounded-xl border border-[var(--festival-border)] bg-white px-4 py-3 text-right transition-colors hover:border-[var(--festival-gold)] hover:bg-[var(--festival-surface)] disabled:opacity-50"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold text-[var(--festival-ink)]">
                    {p.nameAr}
                  </span>
                  {(p.className || p.teamLabel) ? (
                    <span className="block text-sm text-[var(--festival-ink-muted)]">
                      {[p.className, p.teamLabel].filter(Boolean).join(" · ")}
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 rounded-lg bg-[var(--festival-sky-blue)] px-3 py-1 text-sm font-semibold text-royal">
                  إضافة
                </span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
