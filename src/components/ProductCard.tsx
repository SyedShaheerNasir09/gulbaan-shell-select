import Link from "next/link";
import Image from "next/image";
import { imageSrc } from "@/sanity/image";
import { formatPrice } from "@/lib/utils";
import type { ProductCardData } from "@/lib/types";

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductCardData;
  priority?: boolean;
}) {
  const src = product.image ? imageSrc(product.image, 800) : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-4xl border border-white/60 bg-ivory/80 shadow-soft backdrop-blur-sm transition-all duration-500 ease-petal hover:-translate-y-1.5 hover:shadow-petal"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        {src ? (
          <Image
            src={src}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
            priority={priority}
            className="object-cover transition-transform duration-[1.2s] ease-petal group-hover:scale-[1.06]"
          />
        ) : (
          <div className="grid h-full place-items-center text-clay/50">
            <span className="text-sm">No image</span>
          </div>
        )}

        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-ivory/90 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-bloom shadow-sm">
            Florist's pick
          </span>
        )}

        {/* gentle vignette on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bark/15 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        {product.category?.title && (
          <span className="eyebrow mb-2 text-[0.65rem]">{product.category.title}</span>
        )}
        <h3 className="display text-xl leading-snug text-bark transition-colors group-hover:text-bloom">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm text-bark/60">
            {product.shortDescription}
          </p>
        )}
        <p className="mt-4 text-sm font-semibold tracking-wide text-bloom">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  );
}
