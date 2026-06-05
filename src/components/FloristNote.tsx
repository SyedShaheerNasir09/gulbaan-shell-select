import { Sprig, LeafBranch } from "@/components/FloralDecor";

export function FloristNote({
  message,
  author,
  signature,
}: {
  message?: string;
  author?: string;
  signature?: string;
}) {
  if (!message) return null;
  return (
    <section className="mx-auto my-24 max-w-5xl px-5 sm:px-8">
      <div className="relative overflow-hidden rounded-5xl border border-white/60 bg-petal-gradient px-8 py-14 text-center shadow-soft sm:px-16">
        <div className="pointer-events-none absolute left-4 top-4 text-rose/40">
          <Sprig className="h-20 w-20" />
        </div>
        <div className="pointer-events-none absolute bottom-2 right-2 text-fern/40">
          <LeafBranch className="h-24 w-36 -scale-x-100" />
        </div>

        <p className="eyebrow">A note from the florist</p>
        <p className="handwritten mx-auto mt-5 max-w-2xl text-2xl leading-relaxed text-bark sm:text-3xl">
          “{message}”
        </p>
        {(author || signature) && (
          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-bark/60">
            {signature || author}
          </p>
        )}
      </div>
    </section>
  );
}
