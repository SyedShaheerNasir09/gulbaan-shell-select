import { ShellScallop } from "@/components/ShellMark";
import type { StoreLocation } from "@/lib/types";

function StoreCard({ s }: { s: StoreLocation }) {
  return (
    <div className="flex h-full flex-col rounded-4xl border border-white/60 bg-ivory/80 p-6 shadow-soft">
      <div className="mb-1 flex items-center gap-2">
        <ShellScallop className="h-5 w-5" />
        <p className="display text-xl text-bark">{s.name}</p>
      </div>
      {s.area && <p className="text-sm text-clay">{s.area}</p>}
      {s.address && <p className="mt-2 text-sm text-bark/70">{s.address}</p>}
      {!s.address && (
        <p className="mt-2 text-sm italic text-clay">Full address coming soon.</p>
      )}
      {s.mapUrl && (
        <a
          href={s.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-bloom hover:underline"
        >
          📍 Get directions →
        </a>
      )}
    </div>
  );
}

export function StoreLocator({
  locations,
  title = "Visit us at Shell Select",
  compact = false,
}: {
  locations: StoreLocation[];
  title?: string;
  compact?: boolean;
}) {
  if (!locations || locations.length === 0) return null;
  const single = locations.length === 1;

  return (
    <section id="stores" className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="mb-8 flex items-center gap-3">
        <ShellScallop className="h-7 w-7" />
        <div>
          <h2 className="display text-3xl text-bark">{title}</h2>
          <p className="text-sm text-clay">
            {single
              ? "Gulbaan blooms are available at our Shell Select store."
              : "Gulbaan blooms are available at these Shell Select stores."}
          </p>
        </div>
      </div>

      {single ? (
        <div className="max-w-md">
          <StoreCard s={locations[0]} />
        </div>
      ) : (
        <div className={`grid gap-4 ${compact ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {locations.map((s) => (
            <StoreCard key={s._id} s={s} />
          ))}
        </div>
      )}
    </section>
  );
}
