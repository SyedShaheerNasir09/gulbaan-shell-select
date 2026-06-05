import type { Testimonial } from "@/lib/types";

function Stars({ rating = 5 }: { rating?: number }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="text-gold" aria-label={`${full} out of 5`}>
      {"★".repeat(full)}
      <span className="text-bark/20">{"★".repeat(5 - full)}</span>
    </span>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <section className="mx-auto my-24 max-w-7xl px-5 sm:px-8">
      <div className="mb-8 text-center">
        <p className="eyebrow">Loved in-store</p>
        <h2 className="display mt-2 text-3xl text-bark sm:text-4xl">
          From Shell Select shoppers
        </h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.slice(0, 6).map((t) => (
          <figure
            key={t._id}
            className="flex h-full flex-col rounded-4xl border border-white/60 bg-ivory/80 p-6 shadow-soft"
          >
            <Stars rating={t.rating} />
            <blockquote className="mt-3 flex-1 text-pretty text-bark/80">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-semibold text-bark">{t.author}</span>
              {t.location && <span className="block text-clay">{t.location}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
