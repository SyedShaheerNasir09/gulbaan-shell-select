import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shared "petal" easing for Framer Motion (typed as a cubic-bezier tuple). */
export const EASE_PETAL: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Format a price with currency. e.g. formatPrice(12600, "PKR") -> "Rs 12,600" */
export function formatPrice(price?: number, currency = "PKR"): string {
  if (price === undefined || price === null || Number.isNaN(price)) {
    return "Price on request";
  }
  const rounded = Math.round(price);
  const grouped = rounded.toLocaleString("en-US");
  if (currency === "USD") return `$${grouped}`;
  return `Rs ${grouped}`;
}

/** Split plain-text description into clean paragraphs for rendering. */
export function toParagraphs(text?: string): string[] {
  if (!text) return [];
  return text
    .replace(/\r/g, "")
    .split(/\n{1,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Fallback short description if none was set. */
export function deriveShort(short?: string, full?: string): string {
  if (short && short.trim()) return short.trim();
  if (!full) return "";
  const flat = full.replace(/\s+/g, " ").trim();
  return flat.length > 150 ? `${flat.slice(0, 147)}…` : flat;
}
