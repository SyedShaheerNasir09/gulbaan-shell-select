"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/** Fires a single analytics event when mounted (e.g. product / category views). */
export function Track({
  event,
  params,
}: {
  event: string;
  params?: Record<string, unknown>;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
