import { ProductCard } from "@/components/ProductCard";
import type { ProductCardData } from "@/lib/types";

export function RelatedProducts({ products }: { products: ProductCardData[] }) {
  if (!products || products.length === 0) return null;
  return (
    <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="display text-3xl text-bark">You may also love</h2>
        <span className="handwritten text-xl text-bloom/70">more in bloom</span>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
