"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ParticipantNamePicker,
  type PickableParticipant,
} from "@/components/ParticipantNamePicker";
import { QrScanner } from "@/components/QrScanner";
import {
  ATTENDANCE_SCORES,
  parseParticipantIdFromQr,
  type AttendanceScore,
} from "@/lib/attendanceConstants";

interface ParticipantView {
  id: string;
  nameAr: string;
  className: string;
  teamLabel: string;
  points: number;
}

interface QueueItem {
  key: string;
  participant: ParticipantView;
  score: AttendanceScore;
}

interface AttendanceFlowProps {
  initialId?: string;
}

type InputMode = "scan" | "name";

function newQueueKey(id: string) {
  return `${id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AttendanceFlow({ initialId }: AttendanceFlowProps) {
  const [mode, setMode] = useState<InputMode>("scan");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [demo, setDemo] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [manualId, setManualId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [lastSaved, setLastSaved] = useState<{
    count: number;
    totalPoints: number;
  } | null>(null);
  const recentScansRef = useRef<Map<string, number>>(new Map());
  const initialHandledRef = useRef(false);
  const lookingUpRef = useRef(false);

  const addToQueue = useCallback((participant: ParticipantView, isDemo: boolean) => {
    setQueue((prev) => [
      ...prev,
      {
        key: newQueueKey(participant.id),
        participant,
        score: 10,
      },
    ]);
    setDemo(isDemo);
    setStatus(`✓ تمت إضافة ${participant.nameAr}`);
    setError("");
    setLastSaved(null);
  }, []);

  const addByParticipant = useCallback(
    (participant: PickableParticipant, isDemo: boolean) => {
      const now = Date.now();
      const last = recentScansRef.current.get(participant.id.toLowerCase());
      if (last && now - last < 800) return;
      recentScansRef.current.set(participant.id.toLowerCase(), now);
      addToQueue(participant, isDemo);
    },
    [addToQueue],
  );

  const lookupAndAdd = useCallback(
    async (raw: string) => {
      if (lookingUpRef.current) return;

      const id = parseParticipantIdFromQr(raw);
      if (!id) {
        setError("لم يُقرأ باركود صالح — جرّب مرة أخرى أو اختر بالاسم");
        return;
      }

      const now = Date.now();
      const lastScan = recentScansRef.current.get(id.toLowerCase());
      if (lastScan && now - lastScan < 2500) return;
      recentScansRef.current.set(id.toLowerCase(), now);

      lookingUpRef.current = true;
      setLookingUp(true);
      setError("");

      try {
        const res = await fetch(
          `/api/attendance/lookup?id=${encodeURIComponent(id)}`,
        );
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "لم يُعثر على المشارك");
          return;
        }

        addToQueue(data.participant, Boolean(data.demo));
      } catch {
        setError("تعذّر الاتصال — تحقق من الإنترنت");
      } finally {
        lookingUpRef.current = false;
        setLookingUp(false);
      }
    },
    [addToQueue],
  );

  useEffect(() => {
    if (initialId && !initialHandledRef.current) {
      initialHandledRef.current = true;
      lookupAndAdd(initialId);
    }
  }, [initialId, lookupAndAdd]);

  function setItemScore(key: string, score: AttendanceScore) {
    setQueue((prev) =>
      prev.map((item) => (item.key === key ? { ...item, score } : item)),
    );
  }

  function removeItem(key: string) {
    setQueue((prev) => prev.filter((item) => item.key !== key));
  }

  function clearQueue() {
    setQueue([]);
    setStatus("");
    setError("");
    setLastSaved(null);
  }

  async function submitAll() {
    if (queue.length === 0 || submitting) return;

    setSubmitting(true);
    setError("");
    setStatus("");

    try {
      const res = await fetch("/api/attendance/record-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          records: queue.map((item) => ({
            id: item.participant.id,
            score: item.score,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok && !data.saved) {
        setError(data.error ?? "فشل التسجيل");
        return;
      }

      const saved = data.saved ?? 0;
      const totalPoints = (data.results ?? []).reduce(
        (sum: number, r: { scoreAdded: number }) => sum + r.scoreAdded,
        0,
      );

      setLastSaved({ count: saved, totalPoints });
      setQueue([]);
      setStatus(
        data.failed
          ? `تم حفظ ${saved} — فشل ${data.failed}`
          : `تم حفظ ${saved} مشارك بنجاح`,
      );

      if (data.errors?.length) {
        setError(
          data.errors
            .map((e: { id: string; error: string }) => e.error)
            .join(" · "),
        );
      }
    } catch {
      setError("تعذّر الحفظ — تحقق من الإنترنت");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <ol className="church-card space-y-2 p-4 text-base leading-relaxed text-[var(--festival-ink)]">
        <li>
          <span className="font-bold text-royal">١.</span> امسح الباركود{" "}
          <strong>أو</strong> اختر الاسم من القائمة
        </li>
        <li>
          <span className="font-bold text-royal">٢.</span> اختر النقاط لكل
          اسم (١٠ أو ٢٠ أو ٣٠)
        </li>
        <li>
          <span className="font-bold text-royal">٣.</span> اضغط{" "}
          <strong>حفظ الكل</strong>
        </li>
      </ol>

      {demo && mode === "scan" ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-center text-base text-amber-900">
          وضع تجريبي — لن تُحفظ البيانات في الشيت
        </p>
      ) : null}

      <div className="church-card overflow-hidden p-4">
        <div
          className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-[var(--festival-surface)] p-1"
          role="tablist"
          aria-label="طريقة الإضافة"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "scan"}
            className="min-h-12 rounded-lg text-base font-bold transition-colors"
            style={{
              background:
                mode === "scan" ? "var(--festival-bg-elevated)" : "transparent",
              color:
                mode === "scan"
                  ? "var(--festival-royal-blue)"
                  : "var(--festival-ink-muted)",
              boxShadow:
                mode === "scan" ? "0 1px 4px rgba(26,61,122,0.12)" : "none",
            }}
            onClick={() => setMode("scan")}
          >
            مسح باركود
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "name"}
            className="min-h-12 rounded-lg text-base font-bold transition-colors"
            style={{
              background:
                mode === "name" ? "var(--festival-bg-elevated)" : "transparent",
              color:
                mode === "name"
                  ? "var(--festival-royal-blue)"
                  : "var(--festival-ink-muted)",
              boxShadow:
                mode === "name" ? "0 1px 4px rgba(26,61,122,0.12)" : "none",
            }}
            onClick={() => setMode("name")}
          >
            اختيار بالاسم
          </button>
        </div>

        {mode === "scan" ? (
          <>
            <div className="relative">
              <QrScanner
                onScan={lookupAndAdd}
                onError={setError}
                paused={lookingUp || submitting}
              />
              {lookingUp ? (
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/50 text-lg font-bold text-white"
                  aria-live="polite"
                >
                  جاري التحقق…
                </div>
              ) : null}
            </div>

            <details className="mt-4 rounded-xl border border-[var(--festival-border)] bg-[var(--festival-surface)] px-4 py-3">
              <summary className="cursor-pointer text-base font-semibold text-royal">
                إدخال المعرّف يدوياً
              </summary>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      lookupAndAdd(manualId);
                      setManualId("");
                    }
                  }}
                  className="min-h-12 flex-1 rounded-xl border border-[var(--festival-border)] bg-white px-4 text-base"
                  placeholder="المعرّف أو الاسم الكامل"
                  disabled={lookingUp || submitting}
                />
                <button
                  type="button"
                  className="btn-primary min-h-12 px-6 text-base"
                  disabled={lookingUp || submitting || !manualId.trim()}
                  onClick={() => {
                    lookupAndAdd(manualId);
                    setManualId("");
                  }}
                >
                  إضافة
                </button>
              </div>
            </details>
          </>
        ) : (
          <ParticipantNamePicker
            onSelect={addByParticipant}
            disabled={lookingUp || submitting}
            onDemoChange={setDemo}
          />
        )}
      </div>

      {status ? (
        <p
          className="rounded-xl bg-[var(--festival-sky-blue)] px-4 py-3 text-center text-lg font-semibold text-royal"
          role="status"
        >
          {status}
        </p>
      ) : null}

      {error ? (
        <p
          className="rounded-xl bg-red-50 px-4 py-3 text-center text-lg text-[var(--festival-scripture-red)]"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {lastSaved ? (
        <div className="church-card-elevated p-5 text-center">
          <p className="mb-1 text-3xl" aria-hidden>
            ✓
          </p>
          <p className="text-gold text-xl font-bold">
            {lastSaved.count} مشارك — +{lastSaved.totalPoints} نقطة
          </p>
        </div>
      ) : null}

      {queue.length > 0 ? (
        <div className="church-card p-4">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="section-title text-xl">
              القائمة ({queue.length})
            </h2>
            <button
              type="button"
              className="min-h-11 rounded-lg px-3 text-base text-[var(--festival-ink-muted)] hover:bg-[var(--festival-surface)]"
              onClick={clearQueue}
              disabled={submitting}
            >
              مسح الكل
            </button>
          </div>

          <ul className="space-y-4">
            {queue.map((item) => (
              <li
                key={item.key}
                className="rounded-xl border border-[var(--festival-border)] bg-white p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-[var(--festival-ink)]">
                      {item.participant.nameAr}
                    </p>
                    {(item.participant.className || item.participant.teamLabel) ? (
                      <p className="text-base text-[var(--festival-ink-muted)]">
                        {[item.participant.className, item.participant.teamLabel]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    aria-label={`حذف ${item.participant.nameAr}`}
                    disabled={submitting}
                    onClick={() => removeItem(item.key)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--festival-border)] text-xl text-[var(--festival-ink-muted)] hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                  >
                    ×
                  </button>
                </div>

                <p className="mb-2 text-sm font-semibold text-[var(--festival-ink-muted)]">
                  النقاط
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {ATTENDANCE_SCORES.map((score) => (
                    <button
                      key={score}
                      type="button"
                      disabled={submitting}
                      onClick={() => setItemScore(item.key, score)}
                      className="min-h-14 rounded-xl text-xl font-bold transition-colors disabled:opacity-50"
                      style={{
                        border:
                          item.score === score
                            ? "3px solid var(--festival-gold)"
                            : "2px solid var(--festival-border)",
                        background:
                          item.score === score
                            ? "var(--festival-surface)"
                            : "white",
                        color: "var(--festival-royal-blue)",
                      }}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="btn-primary mt-5 min-h-14 w-full text-lg"
            disabled={submitting}
            onClick={submitAll}
          >
            {submitting ? "جاري الحفظ…" : `حفظ الكل (${queue.length})`}
          </button>
        </div>
      ) : (
        <p className="text-center text-base text-[var(--festival-ink-muted)]">
          امسح باركوداً أو اختر اسماً لتبدأ القائمة
        </p>
      )}
    </div>
  );
}
