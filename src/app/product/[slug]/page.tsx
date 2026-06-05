import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/client";
import {
  productBySlugQuery,
  relatedProductsQuery,
  allProductSlugsQuery,
  siteSettingsQuery,
  allStoreLocationsQuery,
} from "@/sanity/queries";
import type {
  Product,
  ProductCardData,
  SiteSettings,
  StoreLocation,
} from "@/lib/types";
import { formatPrice, toParagraphs } from "@/lib/utils";
import { SiteShell } from "@/components/SiteShell";
import { ImageGallery } from "@/components/ImageGallery";
import { RelatedProducts } from "@/components/RelatedProducts";
import { AvailabilityList } from "@/components/AvailabilityList";
import { Track } from "@/components/Track";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: allProductSlugsQuery,
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
  const product = await sanityFetch<Product | null>({
    query: productBySlugQuery,
    params: { slug },
    fallback: null,
  });
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription || product.description?.slice(0, 150),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await sanityFetch<Product | null>({
    query: productBySlugQuery,
    params: { slug },
    fallback: null,
    tags: [`product:${slug}`],
  });

  if (!product) notFound();

  const [related, settings, storeLocations] = await Promise.all([
    sanityFetch<ProductCardData[]>({
      query: relatedProductsQuery,
      params: { slug, categoryId: product.category?._id || "" },
      fallback: [],
    }),
    sanityFetch<SiteSettings>({
      query: siteSettingsQuery,
      fallback: {},
      tags: ["siteSettings"],
    }),
    sanityFetch<StoreLocation[]>({
      query: allStoreLocationsQuery,
      fallback: [],
      tags: ["storeLocation"],
    }),
  ]);

  const paragraphs = toParagraphs(product.description);

  return (
    <SiteShell>
      <Track
        event="view_item"
        params={{ item_name: product.name, item_category: product.category?.title }}
      />
      <article className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-clay">
          <Link href="/store" className="hover:text-bloom">Catalogue</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/category/${product.category.slug}`} className="hover:text-bloom">
                {product.category.title}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-bark/70">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <ImageGallery images={product.images || []} name={product.name} />

          {/* Details */}
          <div className="lg:pt-4">
            {product.category && (
              <Link
                href={`/category/${product.category.slug}`}
                className="pill hover:border-bloom/40 hover:text-bloom"
              >
                {product.category.title}
              </Link>
            )}

            <h1 className="display mt-4 text-4xl leading-tight sm:text-5xl">
              {product.name}
            </h1>

            {product.variant && (
              <p className="mt-2 text-sm text-clay">Variant · {product.variant}</p>
            )}

            <p className="mt-5 text-2xl font-semibold text-bloom">
              {formatPrice(product.price, product.currency)}
            </p>

            {product.shortDescription && (
              <p className="mt-6 text-pretty text-lg text-bark/80">
                {product.shortDescription}
              </p>
            )}

            {/* Full description */}
            {paragraphs.length > 0 && (
              <div className="mt-6 space-y-3 text-pretty leading-relaxed text-bark/75">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            {/* Catalogue-only callout (no checkout) */}
            <div className="mt-8 rounded-4xl border border-bloom/15 bg-petal-gradient p-6">
              <p className="handwritten text-2xl text-bloom">Found something lovely?</p>
              <p className="mt-1 text-sm text-bark/75">
                This is a visual catalogue — there&apos;s no online checkout. Ask for this
                arrangement at the{" "}
                <span className="font-medium text-bark">Shell Select</span> store.
              </p>
            </div>

            {/* Where to find it — the Shell Select store */}
            <AvailabilityList
              locations={storeLocations}
              fallbackMessage={settings.availabilityMessage}
            />

            {/* Extra product info */}
            {product.productInfo && (
              <div className="mt-8">
                <h2 className="eyebrow mb-2">Good to know</h2>
                <div className="space-y-2 whitespace-pre-line text-sm text-bark/70">
                  {product.productInfo}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      <RelatedProducts products={related} />
    </SiteShell>
  );
}
