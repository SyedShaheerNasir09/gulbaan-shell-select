"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

/**
 * In-store welcome ribbon shown when a visitor arrives via a QR code
 * (URL contains ?qr=1). Helps orient scan-to-browse customers.
 */
export function QrWelcome() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isQr = params.get("qr") === "1" || params.has("shell");
    if (!isQr) return;
    if (sessionStorage.getItem("qr-welcome-dismissed") === "1") return;
    setShow(true);
    track("qr_entry", { source: "in_store" });
  }, []);

  if (!show) return null;

  return (
    <div className="mx-auto mt-4 max-w-7xl px-5 sm:px-8">
      <div className="relative flex items-center gap-3 rounded-3xl border border-bloom/20 bg-petal-gradient px-5 py-3 pr-10 text-sm text-bark shadow-soft">
        <span className="text-lg" aria-hidden>
          👋
        </span>
        <p>
          <span className="font-semibold">Welcome!</span> You&apos;re browsing Gulbaan
          in-store at <span className="font-semibold">Shell Select</span>. Tap any bloom to
          explore — show your favourite at the counter.
        </p>
        <button
          onClick={() => {
            sessionStorage.setItem("qr-welcome-dismissed", "1");
            setShow(false);
          }}
          aria-label="Dismiss"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-bark/50 hover:text-bark"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
