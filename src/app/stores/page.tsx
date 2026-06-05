import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/client";
import { allStoreLocationsQuery, siteSettingsQuery } from "@/sanity/queries";
import type { StoreLocation, SiteSettings } from "@/lib/types";
import { SiteShell } from "@/components/SiteShell";
import { StoreLocator } from "@/components/StoreLocator";
import { Track } from "@/components/Track";
import { ShellMark } from "@/components/ShellMark";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Find a Shell Select Store",
  description:
    "Visit the Shell Select store that carries the Gulbaan floral collection.",
};

export default async function StoresPage() {
  const [locations, settings] = await Promise.all([
    sanityFetch<StoreLocation[]>({
      query: allStoreLocationsQuery,
      fallback: [],
      tags: ["storeLocation"],
    }),
    sanityFetch<SiteSettings>({
      query: siteSettingsQuery,
      fallback: {},
      tags: ["siteSettings"],
    }),
  ]);

  return (
    <SiteShell>
      <Track event="find_store" />
      <section className="px-5 pt-14 sm:px-8 sm:pt-20">
        <div className="mx-auto max-w-7xl">
          <ShellMark className="mb-3" prefix="Gulbaan ×" label="Shell Select" />
          <h1 className="display mt-2 text-balance text-4xl leading-[1.05] sm:text-6xl">
            {settings.storeLocatorTitle || "Visit us at Shell Select"}
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-bark/70">
            {settings.availabilityMessage ||
              "Gulbaan blooms are available at our Shell Select store."}
          </p>
        </div>
      </section>

      <div className="mt-12">
        {locations.length > 0 ? (
          <StoreLocator locations={locations} title="Our Shell Select store" />
        ) : (
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <div className="rounded-4xl border border-dashed border-bark/15 bg-ivory/50 py-16 text-center">
              <p className="display text-2xl text-bark">Store list coming soon</p>
              <p className="mt-2 text-sm text-clay">
                Store locations are added in the CMS.{" "}
                <Link href="/store" className="text-bloom underline underline-offset-4">
                  Browse the catalogue
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-5 sm:px-8">
        <Link href="/store" className="btn-ghost">
          ← Back to catalogue
        </Link>
      </div>
    </SiteShell>
  );
}
