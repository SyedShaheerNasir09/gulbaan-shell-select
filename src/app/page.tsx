import Link from "next/link";
import { sanityFetch } from "@/sanity/client";
import { homepageQuery, siteSettingsQuery } from "@/sanity/queries";
import type { Homepage, SiteSettings } from "@/lib/types";
import { LandingCards } from "@/components/LandingCards";
import { LeafBranch, PetalScatter } from "@/components/FloralDecor";
import { ShellMark } from "@/components/ShellMark";
import { GulbaanLogo } from "@/components/GulbaanLogo";

export const revalidate = 60;

const FALLBACK: Homepage = {
  heroEyebrow: "Gulbaan · in bloom at Shell Select",
  heroTitle: "A garden of gifts, gathered for you",
  heroSubtitle:
    "Discover Gulbaan's handcrafted floral collection, now available at Shell Select.",
  primaryCard: {
    title: "Shell Select Store",
    description: "Explore the Gulbaan collection available at Shell Select.",
    buttonLabel: "Enter Store",
  },
  secondaryCard: {
    title: "Coming Soon",
    description: "A new experience is blooming.",
    buttonLabel: "Coming Soon",
    disabled: true,
  },
};

export default async function LandingPage() {
  const [data, settings] = await Promise.all([
    sanityFetch<Homepage>({ query: homepageQuery, fallback: FALLBACK, tags: ["homepage"] }),
    sanityFetch<SiteSettings>({ query: siteSettingsQuery, fallback: {}, tags: ["siteSettings"] }),
  ]);

  const home = { ...FALLBACK, ...data };
  const primary = {
    title: home.primaryCard?.title || FALLBACK.primaryCard!.title!,
    description: home.primaryCard?.description || FALLBACK.primaryCard!.description!,
    buttonLabel: home.primaryCard?.buttonLabel || FALLBACK.primaryCard!.buttonLabel!,
  };
  const secondary = {
    title: home.secondaryCard?.title || FALLBACK.secondaryCard!.title!,
    description: home.secondaryCard?.description || FALLBACK.secondaryCard!.description!,
    buttonLabel: home.secondaryCard?.buttonLabel || FALLBACK.secondaryCard!.buttonLabel!,
    disabled: home.secondaryCard?.disabled ?? true,
  };
  const availability =
    settings.availabilityMessage || "Available at our Shell Select store.";

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      {/* Ambient florals */}
      <div className="pointer-events-none absolute inset-0 -z-10 paper-grain">
        <LeafBranch className="absolute left-[-2rem] top-10 rotate-12 text-sage/40 animate-sway" />
        <LeafBranch className="absolute right-[-3rem] bottom-16 -scale-x-100 -rotate-6 text-fern/30 animate-sway" />
        <PetalScatter className="absolute left-10 bottom-10 text-blush/50 animate-float-slow" />
        <PetalScatter className="absolute right-12 top-16 text-rose/30 animate-float-slow" />
      </div>

      {/* Hero copy */}
      <header className="mb-10 max-w-2xl text-center">
        <div className="mb-6 flex justify-center">
          <GulbaanLogo className="h-16 sm:h-20" />
        </div>
        <div className="mb-5 flex justify-center">
          <ShellMark prefix="Available at" label="Shell Select" />
        </div>
        <p className="eyebrow animate-fade-up">{home.heroEyebrow}</p>
        <h1 className="display mt-4 text-balance text-4xl leading-[1.05] sm:text-6xl">
          {home.heroTitle}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-bark/70 sm:text-lg">
          {home.heroSubtitle}
        </p>
      </header>

      {/* Entry cards */}
      <LandingCards primary={primary} secondary={secondary} />

      {/* Availability + store locator */}
      <div className="mt-10 flex flex-col items-center gap-1.5 text-center">
        <p className="text-sm text-bark/70">{availability}</p>
        <Link
          href="/stores"
          className="text-sm font-medium text-bloom transition hover:underline"
        >
          Visit us at Shell Select →
        </Link>
      </div>

      <p className="mt-8 text-center text-xs uppercase tracking-[0.3em] text-clay/70">
        A visual catalogue · no checkout · just blooms
      </p>
    </main>
  );
}
