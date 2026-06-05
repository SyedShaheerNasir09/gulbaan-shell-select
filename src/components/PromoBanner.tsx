"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Promotion } from "@/lib/types";
import { analytics } from "@/lib/analytics";

export function PromoBanner({ promotions }: { promotions: Promotion[] }) {
  const promo = promotions?.[0];
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!promo) return;
    setDismissed(sessionStorage.getItem(`promo-dismissed-${promo._id}`) === "1");
  }, [promo]);

  if (!promo || dismissed) return null;

  return (
    <div className="relative bg-bloom text-ivory">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-10 py-2.5 text-center text-sm">
        <span className="font-medium">{promo.title}</span>
        {promo.subtitle && (
          <span className="hidden text-ivory/80 sm:inline">— {promo.subtitle}</span>
        )}
        {promo.ctaLink && (
          <Link
            href={promo.ctaLink}
            onClick={() => analytics.selectPromotion(promo.title)}
            className="rounded-full bg-ivory/15 px-3 py-1 text-xs font-semibold transition hover:bg-ivory/25"
          >
            {promo.ctaText || "View"} →
          </Link>
        )}
      </div>
      <button
        onClick={() => {
          sessionStorage.setItem(`promo-dismissed-${promo._id}`, "1");
          setDismissed(true);
        }}
        aria-label="Dismiss promotion"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/70 transition hover:text-ivory"
      >
        ✕
      </button>
    </div>
  );
}
