import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/client";
import {
  categoryBySlugQuery,
  productsByCategoryQuery,
  allCategorySlugsQuery,
} from "@/sanity/queries";
import type { Category, ProductCardData } from "@/lib/types";
import { SiteShell } from "@/components/SiteShell";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { PetalScatter } from "@/components/FloralDecor";
import { Track } from "@/components/Track";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: allCategorySlugsQuery,
    fallback: [],
  });
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await sanityFetch<Category | null>({
    query: categoryBySlugQuery,
    params: { slug },
    fallback: null,
  });
  if (!category) return { title: "Collection" };
  return {
    title: category.title,
    description:
      category.description || `Browse the ${category.title} collection from Gulbaan.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [category, products] = await Promise.all([
    sanityFetch<Category | null>({
      query: categoryBySlugQuery,
      params: { slug },
      fallback: null,
    }),
    sanityFetch<ProductCardData[]>({
      query: productsByCategoryQuery,
      params: { slug },
      fallback: [],
    }),
  ]);

  if (!category) notFound();

  return (
    <SiteShell>
      <Track event="view_item_list" params={{ item_list_name: category.title }} />
      <section className="relative overflow-hidden px-5 pb-10 pt-16 sm:px-8 sm:pt-20">
        <PetalScatter className="pointer-events-none absolute right-6 top-8 text-blush/40 animate-float-slow" />
        <div className="mx-auto max-w-7xl">
          <nav className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-clay">
            <Link href="/store" className="hover:text-bloom">Catalogue</Link>
            <span>/</span>
            <span className="text-bark/70">{category.title}</span>
          </nav>
          <p className="eyebrow">Collection</p>
          <h1 className="display mt-3 text-balance text-4xl leading-[1.05] sm:text-6xl">
            {category.title}
          </h1>
          {category.description && (
            <p className="mt-4 max-w-xl text-pretty text-bark/70">{category.description}</p>
          )}
          <p className="mt-4 text-sm text-clay">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p._id} delay={(i % 4) * 0.05}>
                <ProductCard product={p} priority={i < 4} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-4xl border border-dashed border-bark/15 bg-ivory/50 py-20 text-center">
            <p className="display text-2xl text-bark">Nothing here yet</p>
            <p className="mt-2 text-sm text-clay">
              This collection is still blooming.{" "}
              <Link href="/store" className="text-bloom underline underline-offset-4">
                Back to catalogue
              </Link>
            </p>
          </div>
        )}
      </section>

      <div className="mx-auto mt-16 max-w-7xl px-5 sm:px-8">
        <Link href="/store" className="btn-ghost">
          ← Back to full catalogue
        </Link>
      </div>
    </SiteShell>
  );
}
