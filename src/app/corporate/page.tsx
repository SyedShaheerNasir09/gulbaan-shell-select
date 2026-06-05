import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/client";
import { corporatePageQuery } from "@/sanity/queries";
import type { CorporatePage } from "@/lib/types";
import { SiteShell } from "@/components/SiteShell";
import { Sprig } from "@/components/FloralDecor";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Corporate & Event Gifting",
  description: "Gulbaan floral gifting for corporates, events and bulk orders.",
};

export default async function CorporatePage() {
  const data = await sanityFetch<CorporatePage>({
    query: corporatePageQuery,
    fallback: {},
    tags: ["corporatePage"],
  });

  // Hidden until enabled in the CMS.
  if (!data?.enabled) notFound();

  return (
    <SiteShell>
      <section className="relative overflow-hidden px-5 pt-16 sm:px-8 sm:pt-24">
        <div className="pointer-events-none absolute right-6 top-10 text-sage/30">
          <Sprig className="h-28 w-28" />
        </div>
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow">For business</p>
          <h1 className="display mt-3 text-balance text-4xl leading-[1.05] sm:text-6xl">
            {data.title || "Corporate & Event Gifting"}
          </h1>
          {data.intro && (
            <p className="mt-5 max-w-2xl text-pretty text-lg text-bark/75">{data.intro}</p>
          )}
        </div>
      </section>

      {data.services && data.services.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl px-5 sm:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.services.map((s, i) => (
              <div
                key={i}
                className="rounded-4xl border border-white/60 bg-ivory/80 p-6 shadow-soft"
              >
                <h2 className="display text-xl text-bark">{s.title}</h2>
                {s.description && (
                  <p className="mt-2 text-sm text-bark/70">{s.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto my-20 max-w-3xl px-5 text-center sm:px-8">
        <div className="rounded-5xl border border-bloom/15 bg-petal-gradient p-10">
          <p className="handwritten text-2xl text-bloom">Let&apos;s create something together</p>
          <p className="mt-2 text-bark/75">
            Tell us about your event or corporate gifting needs.
          </p>
          {data.contactEmail && (
            <a href={`mailto:${data.contactEmail}`} className="btn-primary mt-6">
              {data.ctaText || "Enquire now"}
            </a>
          )}
          <div className="mt-6">
            <Link href="/store" className="text-sm text-bloom hover:underline">
              ← Back to catalogue
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
