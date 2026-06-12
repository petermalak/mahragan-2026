"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  type CameraDevice,
} from "html5-qrcode";

interface QrScannerProps {
  onScan: (decoded: string) => void;
  onError?: (message: string) => void;
  paused?: boolean;
}

type ScannerStatus = "loading" | "ready" | "error";

async function pickCameraId(): Promise<string | MediaTrackConstraints> {
  try {
    const cameras: CameraDevice[] = await Html5Qrcode.getCameras();
    if (!cameras.length) return { facingMode: "environment" };

    const back = cameras.find((c) =>
      /back|rear|environment|خلف|وخلف/i.test(c.label),
    );
    if (back) return back.id;

    if (cameras.length > 1) return cameras[cameras.length - 1].id;
    return cameras[0].id;
  } catch {
    return { facingMode: "environment" };
  }
}

export function QrScanner({ onScan, onError, paused = false }: QrScannerProps) {
  const rawId = useId();
  const elementId = `qr-${rawId.replace(/:/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  const pausedRef = useRef(paused);
  const lastScanRef = useRef("");
  const lastScanAtRef = useRef(0);
  const [status, setStatus] = useState<ScannerStatus>("loading");
  const [retryKey, setRetryKey] = useState(0);

  onScanRef.current = onScan;
  onErrorRef.current = onError;
  pausedRef.current = paused;

  const retry = useCallback(() => {
    setStatus("loading");
    setRetryKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let active = true;
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const scanner = new Html5Qrcode(elementId, {
      verbose: false,
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true,
      },
    });
    scannerRef.current = scanner;

    const qrbox = (viewWidth: number, viewHeight: number) => {
      const edge = Math.max(
        50,
        Math.floor(Math.min(viewWidth, viewHeight) * 0.82),
      );
      return { width: edge, height: edge };
    };

    (async () => {
      try {
        const camera = await pickCameraId();
        await scanner.start(
          camera,
          {
            fps: 12,
            qrbox,
            aspectRatio: 1,
            disableFlip: false,
          },
          (text) => {
            if (!active || pausedRef.current) return;

            const now = Date.now();
            if (
              text === lastScanRef.current &&
              now - lastScanAtRef.current < 1500
            ) {
              return;
            }
            lastScanRef.current = text;
            lastScanAtRef.current = now;
            onScanRef.current(text);
          },
          () => {},
        );
        if (active) setStatus("ready");
      } catch {
        if (active) {
          setStatus("error");
          onErrorRef.current?.(
            "تعذّر فتح الكاميرا — استخدم «اختيار بالاسم» بالأسفل",
          );
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
  }, [elementId, retryKey]);

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
          <p className="mb-3">لم تُفتح الكاميرا</p>
          <button type="button" className="btn-primary text-base" onClick={retry}>
            إعادة المحاولة
          </button>
        </div>
      ) : null}

      {status === "ready" ? (
        <div className="qr-scanner-hint" aria-hidden>
          ضع الباركود داخل الإطار
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
