"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
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

function newQueueKey(id: string) {
  return `${id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AttendanceFlow({ initialId }: AttendanceFlowProps) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [demo, setDemo] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [manualId, setManualId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<{
    count: number;
    totalPoints: number;
  } | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanningRef = useRef(false);
  const recentScansRef = useRef<Map<string, number>>(new Map());
  const initialHandledRef = useRef(false);

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
    setStatus(`تمت إضافة ${participant.nameAr}`);
    setError("");
    setLastSaved(null);
  }, []);

  const lookupAndAdd = useCallback(
    async (raw: string) => {
      const id = parseParticipantIdFromQr(raw);
      if (!id) {
        setError("لم يُقرأ معرّف صالح");
        return;
      }

      const now = Date.now();
      const lastScan = recentScansRef.current.get(id.toLowerCase());
      if (lastScan && now - lastScan < 2000) return;
      recentScansRef.current.set(id.toLowerCase(), now);

      setError("");

      const res = await fetch(
        `/api/attendance/lookup?id=${encodeURIComponent(id)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "لم يُعثر على المشارك");
        return;
      }

      addToQueue(data.participant, Boolean(data.demo));
    },
    [addToQueue],
  );

  const stopScanner = useCallback(async () => {
    if (scannerRef.current && scanningRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        /* ignore */
      }
      scanningRef.current = false;
    }
  }, []);

  const startScanner = useCallback(async () => {
    if (typeof window === "undefined") return;
    await stopScanner();

    const scanner = new Html5Qrcode("attendance-qr-reader");
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decoded) => {
          lookupAndAdd(decoded);
        },
        () => {},
      );
      scanningRef.current = true;
    } catch {
      setError("تعذّر فتح الكamera — استخدم الإدخال اليدوي");
    }
  }, [lookupAndAdd, stopScanner]);

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, [startScanner, stopScanner]);

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
    setSubmitting(false);

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
        : `تم حفظ ${saved} مشارك`,
    );

    if (data.errors?.length) {
      setError(
        data.errors.map((e: { id: string; error: string }) => e.error).join(" · "),
      );
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      {demo ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-center text-xs text-amber-900">
          وضع تجريبي — لن تُحفظ البيانات في الشيت
        </p>
      ) : null}

      <div className="church-card overflow-hidden p-4">
        <div
          id="attendance-qr-reader"
          className="overflow-hidden rounded-xl bg-black/5 [&_video]:rounded-xl"
        />
        <div className="mt-3 flex gap-2">
          <input
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                lookupAndAdd(manualId);
                setManualId("");
              }
            }}
            className="flex-1 rounded-lg border border-[var(--festival-border)] bg-white px-3 py-2 text-sm"
            placeholder="معرّف يدوي"
          />
          <button
            type="button"
            className="btn-primary shrink-0 px-4 text-sm"
            onClick={() => {
              lookupAndAdd(manualId);
              setManualId("");
            }}
          >
            إضافة
          </button>
        </div>
      </div>

      {status ? (
        <p className="text-center text-sm text-[var(--festival-royal-blue)]">
          {status}
        </p>
      ) : null}

      {error ? (
        <p className="text-center text-sm text-[var(--festival-scripture-red)]">
          {error}
        </p>
      ) : null}

      {lastSaved ? (
        <div className="church-card p-4 text-center">
          <p className="text-gold text-lg font-bold">
            ✓ {lastSaved.count} سجل — +{lastSaved.totalPoints} نقطة
          </p>
        </div>
      ) : null}

      {queue.length > 0 ? (
        <div className="church-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title text-base">
              القائمة ({queue.length})
            </h2>
            <button
              type="button"
              className="text-xs text-[var(--festival-ink-muted)] hover:underline"
              onClick={clearQueue}
              disabled={submitting}
            >
              مسح
            </button>
          </div>

          <ul className="space-y-3">
            {queue.map((item) => (
              <li
                key={item.key}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--festival-border)] bg-white px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[var(--festival-ink)]">
                    {item.participant.nameAr}
                  </p>
                  <p className="truncate text-xs text-[var(--festival-ink-muted)]">
                    {[item.participant.className, item.participant.teamLabel]
                      .filter(Boolean)
                      .join(" · ") || item.participant.id.slice(0, 8)}
                  </p>
                </div>

                <div className="flex gap-1">
                  {ATTENDANCE_SCORES.map((score) => (
                    <button
                      key={score}
                      type="button"
                      disabled={submitting}
                      onClick={() => setItemScore(item.key, score)}
                      className="rounded-lg px-2.5 py-1.5 text-sm font-bold transition-colors disabled:opacity-50"
                      style={{
                        border:
                          item.score === score
                            ? "2px solid var(--festival-gold)"
                            : "1px solid var(--festival-border)",
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

                <button
                  type="button"
                  aria-label="حذف"
                  disabled={submitting}
                  onClick={() => removeItem(item.key)}
                  className="rounded-lg px-2 py-1 text-sm text-[var(--festival-ink-muted)] hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="btn-primary mt-4 w-full"
            disabled={submitting}
            onClick={submitAll}
          >
            {submitting
              ? "جاري الحفظ…"
              : `حفظ الكل (${queue.length})`}
          </button>
        </div>
      ) : (
        <p className="text-center text-sm text-[var(--festival-ink-muted)]">
          امسح QR أو أدخل معرّفاً — يمكنك إضافة عدة مشاركين ثم الحفظ مرة واحدة
        </p>
      )}
    </div>
  );
}
