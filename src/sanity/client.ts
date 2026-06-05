import { createClient } from "next-sanity";
import type { QueryParams } from "@sanity/client";
import { apiVersion, dataset, projectId, isSanityConfigured } from "./env";

export const client = createClient({
  // A placeholder keeps createClient from throwing before the project is set up.
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/**
 * Resilient fetch helper.
 * - Returns `fallback` (instead of crashing) when Sanity isn't configured yet,
 *   so the landing page and build still work before you add env vars.
 * - Uses Next.js cache tags + ISR revalidation.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
  fallback,
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
  fallback: T;
}): Promise<T> {
  if (!isSanityConfigured) {
    console.warn(
      "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set — returning fallback data. " +
        "Add it to .env.local to load real content.",
    );
    return fallback;
  }

  try {
    const result = await client.fetch<T>(query, params, {
      next: {
        // Time-based ISR; tags also allow optional webhook-based revalidation later.
        revalidate,
        tags,
      },
    });
    // Singleton queries (homepage/siteSettings) return null when the doc doesn't
    // exist — coerce to the fallback so pages never read properties of null.
    return (result ?? fallback) as T;
  } catch (error) {
    console.error("[sanity] fetch failed:", error);
    return fallback;
  }
}
