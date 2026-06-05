/**
 * Gulbaan · Shell Select — catalogue importer
 * ---------------------------------------------------------------------------
 * Reads the local catalogue folder (default C:\catalog), parses each
 * description.txt, uploads images to Sanity, and creates Category + Product
 * documents with auto-generated slugs.
 *
 * Usage:
 *   npm run import:dry     # parse + preview only, NO Sanity writes (safe)
 *   npm run import         # real import (skips products that already exist)
 *   npm run import:force   # re-import & overwrite existing products
 *
 * Env (.env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 *   SANITY_API_WRITE_TOKEN, CATALOG_PATH (optional)
 * ---------------------------------------------------------------------------
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv(); // fall back to .env

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createClient } from "@sanity/client";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const DRY_RUN = process.env.DRY_RUN === "1";
const FORCE = process.env.FORCE === "1";
const CATALOG_PATH = process.env.CATALOG_PATH || "C:\\catalog";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".avif", ".gif"]);
const SKIP_DIRS = new Set(["_work", "node_modules"]);

// Display order for known Gulbaan categories.
const CATEGORY_ORDER: Record<string, number> = {
  "hearts": 10,
  "tacos": 20,
  "green bag": 30,
  "jute wraps": 40,
  "boxes": 50,
  "cutwork sheets": 60,
  "tote drip": 70,
  "farmer's bags": 80,
  "bouquets": 90,
};

// Curated featured picks (case-insensitive, by product name).
const FEATURED_NAMES = new Set(
  [
    "Blush Always",
    "Nordic",
    "Perfect Blush",
    "Sapphire",
    "Marilyn",
    "Dazzle Berry",
    "Tote Drip - Pink Spray Roses",
  ].map((s) => s.toLowerCase()),
);

// The single Shell Select store (sales team can edit the address in Studio).
const STORE_LOCATIONS = [
  {
    id: "storeLocation-shell-select",
    name: "Shell Select",
    city: "",
    area: "",
    address: "Full address coming soon.",
    order: 10,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritics
    .replace(/[\x27\u2019]/g, "") // straight + curly apostrophes
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function titleCase(input: string): string {
  return input
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function contentTypeFor(ext: string): string {
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".heic":
      return "image/heic";
    case ".avif":
      return "image/avif";
    case ".gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}

interface ParsedDescription {
  meta: Record<string, string>;
  body: string;
}

function parseDescription(raw: string): ParsedDescription {
  const marker = "Full Product Description:";
  const idx = raw.indexOf(marker);
  let head = raw;
  let body = "";
  if (idx >= 0) {
    head = raw.slice(0, idx);
    body = raw.slice(idx + marker.length).trim();
  }

  const meta: Record<string, string> = {};
  for (const line of head.split(/\r?\n/)) {
    const m = line.match(/^\s*([^:]+?):\s*(.*)$/);
    if (!m) continue;
    // Normalise key: lowercase + strip parenthetical qualifiers e.g. "Price (PKR)" -> "price"
    const key = m[1].toLowerCase().replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();
    meta[key] = m[2].trim();
  }
  return { meta, body };
}

function makeShortDescription(body: string): string {
  const lines = body
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const labelRe = /^(vibe|key flora|key flowers|perfect for|the vibe|good for)\b/i;
  const pick =
    lines.find((l) => !labelRe.test(l) && l.length > 40) || lines[0] || "";

  const flat = pick.replace(/\s+/g, " ").trim();
  if (flat.length <= 160) return flat;
  return flat.slice(0, 157).replace(/\s+\S*$/, "") + "…";
}

function parsePrice(value?: string): number | undefined {
  if (!value) return undefined;
  const num = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(num) && num > 0 ? num : undefined;
}

interface CatalogItem {
  folder: string;
  dir: string;
  name: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  price?: number;
  currency: string;
  shortDescription: string;
  description: string;
  productInfo: string;
  variant?: string;
  deliveryCities: string[];
  sourceUrl?: string;
  originalTitle?: string;
  featured: boolean;
  images: { file: string; full: string; ext: string }[];
}

function readCatalog(): CatalogItem[] {
  if (!fs.existsSync(CATALOG_PATH)) {
    console.error(`✗ Catalog path not found: ${CATALOG_PATH}`);
    process.exit(1);
  }

  const entries = fs
    .readdirSync(CATALOG_PATH, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !SKIP_DIRS.has(e.name) && !e.name.startsWith("."));

  const items: CatalogItem[] = [];

  for (const entry of entries) {
    const dir = path.join(CATALOG_PATH, entry.name);
    const files = fs.readdirSync(dir);
    const descFile = files.find((f) => f.toLowerCase() === "description.txt");
    if (!descFile) {
      console.warn(`  · skipping "${entry.name}" (no description.txt)`);
      continue;
    }

    const raw = fs.readFileSync(path.join(dir, descFile), "utf8");
    const { meta, body } = parseDescription(raw);

    const name = meta["product name"] || entry.name;
    const categoryName = titleCase(meta["product category"] || "Uncategorised");
    const categorySlug = slugify(meta["product category"] || "uncategorised");
    const deliveryCities = (meta["delivery cities"] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const originalTitle = meta["original site title"];
    const variant = meta["variant"];
    const sourceUrl = meta["product url"];

    const infoLines: string[] = [];
    if (meta["product type"]) infoLines.push(`Type: ${meta["product type"]}`);
    if (originalTitle && originalTitle.toLowerCase() !== name.toLowerCase())
      infoLines.push(`Originally listed as: ${originalTitle}`);
    if (deliveryCities.length)
      infoLines.push(`Available for delivery in: ${deliveryCities.join(", ")}`);

    const images = files
      .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => ({
        file: f,
        full: path.join(dir, f),
        ext: path.extname(f).toLowerCase(),
      }));

    items.push({
      folder: entry.name,
      dir,
      name,
      slug: slugify(name),
      categoryName,
      categorySlug,
      price: parsePrice(meta["price"]),
      currency: "PKR",
      shortDescription: makeShortDescription(body),
      description: body,
      productInfo: infoLines.join("\n"),
      variant,
      deliveryCities,
      sourceUrl,
      originalTitle,
      featured: FEATURED_NAMES.has(name.toLowerCase()) || images.length >= 5,
      images,
    });
  }

  return items.sort((a, b) => a.name.localeCompare(b.name));
}

// ---------------------------------------------------------------------------
// Sanity import
// ---------------------------------------------------------------------------
function getClient() {
  if (!projectId || !token) {
    console.error(
      "✗ Missing Sanity credentials. Set NEXT_PUBLIC_SANITY_PROJECT_ID and " +
        "SANITY_API_WRITE_TOKEN in .env.local (or run `npm run import:dry`).",
    );
    process.exit(1);
  }
  return createClient({ projectId, dataset, token, apiVersion, useCdn: false });
}

function uuidKey(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

/** Retry a Sanity operation on transient (5xx / 429 / network) errors. */
async function withRetry<T>(label: string, fn: () => Promise<T>, retries = 5): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastErr = err;
      const status =
        (err as { statusCode?: number })?.statusCode ??
        (err as { response?: { statusCode?: number } })?.response?.statusCode;
      const retriable = !status || status >= 500 || status === 429;
      if (!retriable || attempt === retries) break;
      console.log(`    … transient error on ${label}${status ? ` (HTTP ${status})` : ""} — retry ${attempt}/${retries - 1}`);
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw lastErr;
}

type WriteClient = ReturnType<typeof createClient>;

/** Seed Shell Select content: store locations, a sample promo, testimonials, B2B singleton. */
async function seedShellContent(client: WriteClient) {
  for (const loc of STORE_LOCATIONS) {
    await client.createIfNotExists({
      _id: loc.id,
      _type: "storeLocation",
      name: loc.name,
      slug: { _type: "slug", current: slugify(loc.name) },
      address: loc.address,
      active: true,
      order: loc.order,
    });
  }
  console.log(`✓ Seeded the Shell Select store location.`);

  // Editable singletons so the Studio is populated out of the box.
  await client.createIfNotExists({
    _id: "siteSettings",
    _type: "siteSettings",
    title: "Gulbaan · Shell Select",
    tagline: "A premium digital flower catalogue.",
    shellSelectNote: "Available exclusively at Shell Select.",
    availabilityMessage: "Available at our Shell Select store.",
    storeLocatorTitle: "Visit us at Shell Select",
    footerNote:
      "Gulbaan is a visual catalogue. To bring an arrangement home, visit us at the Shell Select store.",
  });
  await client.createIfNotExists({
    _id: "homepage",
    _type: "homepage",
    heroEyebrow: "Gulbaan · in bloom at Shell Select",
    heroTitle: "A garden of gifts, gathered for you",
    heroSubtitle:
      "Discover Gulbaan's handcrafted floral collection, now available at Shell Select.",
  });

  await client.createIfNotExists({
    _id: "promotion-sample-fathers-day",
    _type: "promotion",
    title: "Father's Day Collection",
    subtitle: "Available at Shell Select",
    ctaText: "Browse the collection",
    ctaLink: "/store",
    active: true,
    startDate: "2026-06-01T00:00:00Z",
    endDate: "2026-06-30T23:59:59Z",
    order: 10,
  });

  const testimonials = [
    {
      id: "testimonial-sample-1",
      quote:
        "The bouquet I grabbed at Shell Select was fresher than anything I expected from a fuel stop. Absolutely beautiful.",
      author: "Ayesha K.",
      location: "Bought at Shell Select",
      rating: 5,
      order: 10,
    },
    {
      id: "testimonial-sample-2",
      quote:
        "Picked up flowers at Shell Select on my way home. Wrapped beautifully and smelled incredible.",
      author: "Bilal R.",
      location: "Bought at Shell Select",
      rating: 5,
      order: 20,
    },
  ];
  for (const t of testimonials) {
    await client.createIfNotExists({
      _id: t.id,
      _type: "testimonial",
      quote: t.quote,
      author: t.author,
      location: t.location,
      rating: t.rating,
      featured: true,
      order: t.order,
    });
  }

  await client.createIfNotExists({
    _id: "corporatePage",
    _type: "corporatePage",
    enabled: false,
    title: "Corporate & Event Gifting",
    intro:
      "Thoughtful floral gifting at scale — for corporate gifts, events and bulk orders.",
  });
  console.log("✓ Seeded sample promotion, testimonials, and (hidden) corporate page.\n");
}

async function run() {
  console.log("───────────────────────────────────────────────");
  console.log(`Gulbaan catalogue import  ${DRY_RUN ? "(DRY RUN — no writes)" : ""}`);
  console.log(`Source : ${CATALOG_PATH}`);
  console.log(`Dataset: ${dataset}${FORCE ? "  · FORCE overwrite" : ""}`);
  console.log("───────────────────────────────────────────────\n");

  const items = readCatalog();
  console.log(`Found ${items.length} product folders.\n`);

  // Summary counters
  let created = 0;
  let skipped = 0;
  let imagesUploaded = 0;
  let heic = 0;
  const categories = new Map<string, { name: string; slug: string }>();

  const client = DRY_RUN ? null : getClient();

  // Seed Shell Select content (store locations, sample promo/testimonials, B2B singleton).
  if (!DRY_RUN && client) {
    await seedShellContent(client);
  } else {
    console.log(`(dry run) would seed ${STORE_LOCATIONS.length} store locations + sample promo/testimonials.\n`);
  }

  for (const item of items) {
    const heicCount = item.images.filter((i) => i.ext === ".heic").length;
    heic += heicCount;
    categories.set(item.categorySlug, { name: item.categoryName, slug: item.categorySlug });

    if (DRY_RUN) {
      console.log(`• ${item.name}`);
      console.log(`    slug      : ${item.slug}`);
      console.log(`    category  : ${item.categoryName} (${item.categorySlug})`);
      console.log(`    price     : ${item.price ?? "—"} ${item.currency}`);
      console.log(`    images    : ${item.images.length}${heicCount ? `  (${heicCount} HEIC)` : ""}`);
      console.log(`    featured  : ${item.featured ? "yes" : "no"}`);
      console.log(`    status    : live`);
      console.log(`    short     : ${item.shortDescription}`);
      if (item.variant) console.log(`    variant   : ${item.variant}`);
      console.log("");
      continue;
    }

    const productId = `product-${item.slug}`;

    // Skip existing unless FORCE
    if (!FORCE) {
      const existing = await client!.getDocument(productId).catch(() => null);
      if (existing) {
        console.log(`↷ ${item.name} — already exists, skipping (use import:force to overwrite)`);
        skipped++;
        continue;
      }
    }

    // 1) Ensure category exists
    const categoryId = `category-${item.categorySlug}`;
    await client!.createIfNotExists({
      _id: categoryId,
      _type: "category",
      title: item.categoryName,
      slug: { _type: "slug", current: item.categorySlug },
      order: CATEGORY_ORDER[item.categorySlug] ?? 100,
    });

    // 2) Upload images
    console.log(`↑ ${item.name} — uploading ${item.images.length} image(s)…`);
    const imageRefs: any[] = [];
    for (let i = 0; i < item.images.length; i++) {
      const img = item.images[i];
      if (img.ext === ".heic") {
        console.log(`    ⚠ ${img.file} is HEIC — uploaded as-is (served via ?fm=jpg).`);
      }
      const buffer = fs.readFileSync(img.full);
      const asset = await withRetry(`upload ${img.file}`, () =>
        client!.assets.upload("image", buffer, {
          filename: img.file,
          contentType: contentTypeFor(img.ext),
        }),
      );
      imagesUploaded++;
      imageRefs.push({
        _type: "image",
        _key: crypto.randomUUID().replace(/-/g, "").slice(0, 12),
        asset: { _type: "reference", _ref: asset._id },
        alt: `${item.name} — ${i + 1}`,
      });
    }

    // 3) Create / replace product
    const doc = {
      _id: productId,
      _type: "product",
      name: item.name,
      slug: { _type: "slug", current: item.slug },
      category: { _type: "reference", _ref: categoryId },
      price: item.price,
      currency: item.currency,
      shortDescription: item.shortDescription,
      description: item.description,
      productInfo: item.productInfo,
      variant: item.variant,
      deliveryCities: item.deliveryCities,
      sourceUrl: item.sourceUrl,
      originalTitle: item.originalTitle,
      images: imageRefs,
      featured: item.featured,
      status: "live",
    };

    await withRetry(`save ${item.name}`, () => client!.createOrReplace(doc));
    created++;
    console.log(`✓ ${item.name} — done (${imageRefs.length} images)\n`);
  }

  // Summary
  console.log("\n═══════════════════ SUMMARY ═══════════════════");
  console.log(`Product folders read : ${items.length}`);
  console.log(`Categories           : ${categories.size} (${[...categories.values()].map((c) => c.name).join(", ")})`);
  if (DRY_RUN) {
    const totalImgs = items.reduce((n, i) => n + i.images.length, 0);
    console.log(`Images (would upload): ${totalImgs}`);
    console.log(`HEIC images          : ${heic}`);
    console.log("\nDRY RUN complete — no data was written to Sanity.");
  } else {
    console.log(`Products created     : ${created}`);
    console.log(`Products skipped     : ${skipped}`);
    console.log(`Images uploaded      : ${imagesUploaded}`);
    console.log(`HEIC images          : ${heic}`);
    console.log("\n✓ Import complete. Open /studio to review, or /store to view the site.");
  }
}

run().catch((err) => {
  console.error("\n✗ Import failed:", err);
  process.exit(1);
});
