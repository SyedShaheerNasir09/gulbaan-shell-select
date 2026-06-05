import type { Metadata } from "next";
import QRCode from "qrcode";
import { sanityFetch } from "@/sanity/client";
import { allCategoriesQuery } from "@/sanity/queries";
import type { Category } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "In-store QR Codes",
  robots: { index: false, follow: false },
};

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://shellselect.gulbaan.com"
).replace(/\/$/, "");

async function makeQr(path: string) {
  const url = `${BASE}${path}`;
  const dataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    width: 600,
    color: { dark: "#2E2A26", light: "#FFFFFFFF" },
  });
  return { url, dataUrl };
}

export default async function QrPage() {
  const categories = await sanityFetch<Category[]>({
    query: allCategoriesQuery,
    fallback: [],
    tags: ["category"],
  });

  const links = [
    { label: "Catalogue · In-store", path: "/store?qr=1" },
    { label: "Home", path: "/?qr=1" },
    ...categories.map((c) => ({ label: c.title, path: `/category/${c.slug}?qr=1` })),
  ];

  const codes = await Promise.all(
    links.map(async (l) => ({ ...l, ...(await makeQr(l.path)) })),
  );

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <header className="mb-10">
        <p className="eyebrow">Staff utility · for printing</p>
        <h1 className="display mt-2 text-4xl text-bark">In-store QR codes</h1>
        <p className="mt-3 max-w-2xl text-bark/70">
          Print these and place them beside the Gulbaan display in the Shell Select store.
          Each code opens the mobile catalogue with the in-store welcome. Set
          <code className="mx-1 rounded bg-sand px-1.5 py-0.5 text-sm">NEXT_PUBLIC_SITE_URL</code>
          to your live domain so the codes point to the right place. Use your browser&apos;s
          Print (Ctrl/Cmd + P) to make a sheet.
        </p>
        <p className="mt-2 text-sm text-clay">Currently pointing at: {BASE}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {codes.map((c) => (
          <figure
            key={c.path}
            className="flex flex-col items-center rounded-4xl border border-bark/10 bg-ivory p-6 text-center shadow-soft"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.dataUrl}
              alt={`QR code for ${c.label}`}
              width={240}
              height={240}
              className="h-60 w-60"
            />
            <figcaption className="mt-3">
              <span className="display text-lg text-bark">{c.label}</span>
              <span className="mt-1 block break-all text-xs text-clay">{c.url}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
