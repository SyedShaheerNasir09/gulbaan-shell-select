import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/client";
import {
  allProductsQuery,
  allCategoriesQuery,
  homepageQuery,
  activePromotionsQuery,
  activeCollectionsQuery,
  testimonialsQuery,
  allStoreLocationsQuery,
} from "@/sanity/queries";
import type {
  Category,
  Collection,
  Homepage,
  ProductCardData,
  Promotion,
  StoreLocation,
  Testimonial,
} from "@/lib/types";
import { SiteShell } from "@/components/SiteShell";
import { CatalogueClient } from "@/components/CatalogueClient";
import { FloristNote } from "@/components/FloristNote";
import { Reveal } from "@/components/Reveal";
import { PetalScatter } from "@/components/FloralDecor";
import { PromoBanner } from "@/components/PromoBanner";
import { QrWelcome } from "@/components/QrWelcome";
import { Testimonials } from "@/components/Testimonials";
import { StoreLocator } from "@/components/StoreLocator";
import { ProductCard } from "@/components/ProductCard";
import { ShellMark } from "@/components/ShellMark";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Browse Gulbaan's floral collection available at Shell Select — bouquets, boxes, jute wraps and more.",
};

export default async function StorePage() {
  const [products, categories, home, promotions, collections, testimonials, locations] =
    await Promise.all([
      sanityFetch<ProductCardData[]>({ query: allProductsQuery, fallback: [], tags: ["product"] }),
      sanityFetch<Category[]>({ query: allCategoriesQuery, fallback: [], tags: ["category"] }),
      sanityFetch<Homepage>({ query: homepageQuery, fallback: {}, tags: ["homepage"] }),
      sanityFetch<Promotion[]>({ query: activePromotionsQuery, fallback: [], tags: ["promotion"] }),
      sanityFetch<Collection[]>({ query: activeCollectionsQuery, fallback: [], tags: ["collection"] }),
      sanityFetch<Testimonial[]>({ query: testimonialsQuery, fallback: [], tags: ["testimonial"] }),
      sanityFetch<StoreLocation[]>({ query: allStoreLocationsQuery, fallback: [], tags: ["storeLocation"] }),
    ]);

  return (
    <SiteShell>
      {/* Promotions + in-store QR welcome */}
      <PromoBanner promotions={promotions} />
      <QrWelcome />

      {/* Compact hero — keeps products near the top for mobile / QR visitors */}
      <section className="relative overflow-hidden px-5 pb-6 pt-10 sm:px-8 sm:pt-14">
        <PetalScatter className="pointer-events-none absolute right-6 top-6 text-blush/40 animate-float-slow" />
        <div className="mx-auto max-w-7xl">
          <ShellMark className="mb-3" prefix="In bloom at" label="Shell Select" />
          <h1 className="display max-w-3xl text-balance text-3xl leading-[1.05] sm:text-5xl">
            {home.heroTitle || "Flowers, gathered and gifted with care"}
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-bark/70">
            {home.seasonalNote ||
              "Browse the Gulbaan range available at Shell Select. Search, filter and discover — then pick it up in-store."}
          </p>
        </div>
      </section>

      {/* Search + filters + grid (product-first) */}
      <CatalogueClient products={products} categories={categories} />

      {/* Curated collections */}
      {collections.length > 0 && (
        <div className="mx-auto mt-20 max-w-7xl space-y-14 px-5 sm:px-8">
          {collections.map((col) => (
            <section key={col._id}>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <h2 className="display text-3xl text-bark">{col.title}</h2>
                  {col.description && (
                    <p className="mt-1 max-w-xl text-sm text-bark/60">{col.description}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {(col.products || []).slice(0, 4).map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Browse by collection (categories) */}
      {categories.length > 0 && (
        <section id="categories" className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="display text-3xl text-bark">Browse by collection</h2>
            <span className="handwritten text-xl text-bloom/70">pick a mood</span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c, i) => (
              <Reveal key={c._id} delay={i * 0.04}>
                <Link
                  href={`/category/${c.slug}`}
                  className="group flex h-full flex-col justify-between rounded-4xl border border-white/60 bg-ivory/70 p-6 shadow-soft transition-all duration-500 ease-petal hover:-translate-y-1 hover:shadow-petal"
                >
                  <div>
                    <h3 className="display text-xl text-bark transition-colors group-hover:text-bloom">
                      {c.title}
                    </h3>
                    {c.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-bark/55">{c.description}</p>
                    )}
                  </div>
                  <span className="mt-6 text-xs uppercase tracking-[0.2em] text-clay">
                    {c.count ?? 0} {c.count === 1 ? "piece" : "pieces"} →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <Testimonials testimonials={testimonials} />

      {/* Store locator */}
      {locations.length > 0 && (
        <div className="mt-8">
          <StoreLocator locations={locations} compact />
        </div>
      )}

      {/* Florist note */}
      <FloristNote
        message={home.floristNote?.message}
        author={home.floristNote?.author}
        signature={home.floristNote?.signature}
      />
    </SiteShell>
  );
}
