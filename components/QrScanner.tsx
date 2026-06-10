"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QrScannerProps {
  onScan: (decoded: string) => void;
  onError?: (message: string) => void;
  paused?: boolean;
}

export function QrScanner({ onScan, onError, paused = false }: QrScannerProps) {
  const rawId = useId();
  const elementId = `qr-${rawId.replace(/:/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  const pausedRef = useRef(paused);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  onScanRef.current = onScan;
  onErrorRef.current = onError;
  pausedRef.current = paused;

  useEffect(() => {
    let active = true;
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const scanner = new Html5Qrcode(elementId, { verbose: false });
    scannerRef.current = scanner;

    const qrbox = (viewWidth: number, viewHeight: number) => {
      const edge = Math.floor(Math.min(viewWidth, viewHeight) * 0.7);
      return { width: edge, height: edge };
    };

    (async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 8, qrbox, aspectRatio: 1 },
          (text) => {
            if (active && !pausedRef.current) onScanRef.current(text);
          },
          () => {},
        );
        if (active) setStatus("ready");
      } catch {
        if (active) {
          setStatus("error");
          onErrorRef.current?.("تعذّر فتح الكاميرا — استخدم الإدخال اليدوي بالأسفل");
        }
      }
    })();

    return () => {
      active = false;
      const instance = scannerRef.current;
      scannerRef.current = null;

      void (async () => {
        if (!instance) return;
        try {
          if (instance.isScanning) await instance.stop();
        } catch {
          /* ignore */
        }
        try {
          instance.clear();
        } catch {
          /* ignore */
        }
        container.innerHTML = "";
      })();
    };
  }, [elementId]);

  return (
    <div className="qr-scanner-wrap">
      {status === "loading" ? (
        <div className="qr-scanner-placeholder" aria-live="polite">
          <span className="qr-scanner-spinner" aria-hidden />
          جاري فتح الكاميرا…
        </div>
      ) : null}
      {status === "error" ? (
        <div className="qr-scanner-placeholder qr-scanner-placeholder--error">
          لم تُفتح الكاميرا
        </div>
      ) : null}
      <div
        ref={containerRef}
        id={elementId}
        className="qr-scanner-view"
        hidden={status === "error"}
      />
    </div>
  );
}
