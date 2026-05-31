import { useCallback, useEffect, useRef, useState } from "react";

const SCRIPT_SRC = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

declare global {
  interface Window {
    daum?: {
      Postcode: new (opts: {
        oncomplete: (data: DaumPostcodeData) => void;
        onclose?: () => void;
      }) => { open: () => void };
    };
  }
}

export interface DaumPostcodeData {
  zonecode: string;
  address: string;
  roadAddress: string;
  jibunAddress: string;
  buildingName?: string;
}

export interface DaumAddressResult {
  postalCode: string;
  address: string;
}

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.daum?.Postcode) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
  if (existing) {
    return new Promise((res, rej) => {
      existing.addEventListener("load", () => res());
      existing.addEventListener("error", () => rej(new Error("load failed")));
    });
  }
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => res();
    s.onerror = () => rej(new Error("load failed"));
    document.head.appendChild(s);
  });
}

export function useDaumPostcode() {
  const [ready, setReady] = useState<boolean>(!!(typeof window !== "undefined" && window.daum?.Postcode));
  const loadingRef = useRef(false);

  useEffect(() => {
    if (ready || loadingRef.current) return;
    loadingRef.current = true;
    loadScript()
      .then(() => setReady(true))
      .catch(() => {
        loadingRef.current = false;
      });
  }, [ready]);

  const open = useCallback(
    (onComplete: (result: DaumAddressResult) => void) => {
      const start = () => {
        if (!window.daum?.Postcode) return;
        new window.daum.Postcode({
          oncomplete: (data) => {
            const base = data.roadAddress || data.address || data.jibunAddress;
            const withBuilding = data.buildingName ? `${base} (${data.buildingName})` : base;
            onComplete({ postalCode: data.zonecode, address: withBuilding });
          },
        }).open();
      };
      if (window.daum?.Postcode) {
        start();
      } else {
        loadScript().then(start).catch(() => {});
      }
    },
    [],
  );

  return { ready, open };
}
