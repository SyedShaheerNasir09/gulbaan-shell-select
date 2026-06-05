import type { StoreLocation } from "@/lib/types";

export function AvailabilityList({
  locations,
  fallbackMessage,
}: {
  locations?: StoreLocation[];
  fallbackMessage?: string;
}) {
  const store = locations && locations.length > 0 ? locations[0] : null;

  return (
    <div className="mt-8 rounded-4xl border border-bark/10 bg-ivory/70 p-6">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-bark">
        Available at Shell Select
      </h2>

      {store ? (
        <p className="flex items-start gap-2 text-sm text-bark/80">
          <span className="mt-0.5 text-fern" aria-hidden>
            ✓
          </span>
          <span>
            <span className="font-medium">{store.name}</span>
            {store.area && <span className="text-clay"> · {store.area}</span>}
            {store.address && (
              <span className="mt-0.5 block text-bark/60">{store.address}</span>
            )}
          </span>
        </p>
      ) : (
        <p className="text-sm text-bark/70">
          {fallbackMessage ||
            "Available at our Shell Select store — please ask in-store for current stock."}
        </p>
      )}

      {store?.mapUrl ? (
        <a
          href={store.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-bloom hover:underline"
        >
          📍 Get directions →
        </a>
      ) : (
        <a
          href="/stores"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-bloom hover:underline"
        >
          See store details →
        </a>
      )}
    </div>
  );
}
