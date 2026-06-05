"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { cn, EASE_PETAL } from "@/lib/utils";
import { analytics } from "@/lib/analytics";
import type { Category, ProductCardData } from "@/lib/types";

export function CatalogueClient({
  products,
  categories,
}: {
  products: ProductCardData[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");

  const featured = useMemo(
    () => products.filter((p) => p.featured).slice(0, 6),
    [products],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCat = activeCat === "all" || p.category?.slug === activeCat;
      if (!matchesCat) return false;
      if (!q) return true;
      const haystack = [p.name, p.shortDescription, p.category?.title, p.variant]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [products, query, activeCat]);

  const showFeatured = !query.trim() && activeCat === "all" && featured.length > 0;

  // Report search terms to analytics (debounced) — powers "most searched products".
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const timer = setTimeout(() => analytics.search(q), 700);
    return () => clearTimeout(timer);
  }, [query]);

  function selectCategory(slug: string, title?: string) {
    setActiveCat(slug);
    if (slug !== "all" && title) analytics.viewCategory(title);
  }

  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8">
      {/* Controls */}
      <div className="sticky top-[68px] z-30 -mx-5 mb-8 bg-cream/80 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-clay"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search blooms, bouquets, boxes…"
              aria-label="Search products"
              className="w-full rounded-full border border-bark/10 bg-ivory/90 py-3 pl-11 pr-4 text-sm text-ink shadow-sm outline-none transition focus:border-bloom/40 focus:ring-2 focus:ring-bloom/15"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterPill
              active={activeCat === "all"}
              onClick={() => selectCategory("all")}
              label="All"
              count={products.length}
            />
            {categories.map((c) => (
              <FilterPill
                key={c._id}
                active={activeCat === c.slug}
                onClick={() => selectCategory(c.slug, c.title)}
                label={c.title}
                count={c.count}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Featured strip */}
      {showFeatured && (
        <div id="featured" className="mb-14">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="display text-2xl text-bark sm:text-3xl">Florist&apos;s favourites</h2>
            <span className="handwritten text-xl text-bloom/70">hand-tied with love</span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.slice(0, 4).map((p, i) => (
              <ProductCard key={p._id} product={p} priority={i < 2} />
            ))}
          </div>
        </div>
      )}

      {/* Result count */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="display text-2xl text-bark sm:text-3xl">
          {activeCat === "all"
            ? "The collection"
            : categories.find((c) => c.slug === activeCat)?.title}
        </h2>
        <p className="text-sm text-clay">
          {filtered.length} {filtered.length === 1 ? "bloom" : "blooms"}
        </p>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: EASE_PETAL }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="rounded-4xl border border-dashed border-bark/15 bg-ivory/50 py-20 text-center">
          <p className="display text-2xl text-bark">No blooms found</p>
          <p className="mt-2 text-sm text-clay">
            Try a different word, or{" "}
            <button
              onClick={() => {
                setQuery("");
                setActiveCat("all");
              }}
              className="text-bloom underline underline-offset-4"
            >
              clear your search
            </button>
            .
          </p>
        </div>
      )}
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
        active
          ? "border-bloom bg-bloom text-ivory shadow-petal"
          : "border-bark/10 bg-white/60 text-bark/70 hover:border-bloom/40 hover:text-bloom",
      )}
    >
      {label}
      {typeof count === "number" && (
        <span className={cn("ml-2 text-xs", active ? "text-ivory/70" : "text-clay")}>
          {count}
        </span>
      )}
    </button>
  );
}
