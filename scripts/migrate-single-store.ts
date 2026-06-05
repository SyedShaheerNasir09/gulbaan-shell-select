/**
 * One-off migration: collapse the seeded multi-store data down to a single
 * Shell Select store, and ensure the editable singletons exist.
 *
 * Run:  npm run migrate:single-store
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

if (!projectId || !token) {
  console.error("✗ Missing Sanity credentials in .env.local (project id / write token).");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion, useCdn: false });

async function main() {
  console.log("Migrating to a single Shell Select store…\n");

  // 1) Remove per-product store references (strong refs block store deletion).
  const productIds: string[] = await client.fetch(`*[_type=="product"]._id`);
  if (productIds.length) {
    let tx = client.transaction();
    for (const id of productIds) tx = tx.patch(id, (p) => p.unset(["availableLocations"]));
    await tx.commit();
    console.log(`✓ Cleared availableLocations on ${productIds.length} products.`);
  }

  // 2) Delete all existing store-location documents.
  const storeIds: string[] = await client.fetch(`*[_type=="storeLocation"]._id`);
  for (const id of storeIds) await client.delete(id);
  console.log(`✓ Deleted ${storeIds.length} old store location(s).`);

  // 3) Create the single Shell Select store (placeholder address — edit in Studio).
  await client.createOrReplace({
    _id: "storeLocation-shell-select",
    _type: "storeLocation",
    name: "Shell Select",
    slug: { _type: "slug", current: "shell-select" },
    address: "Full address coming soon.",
    active: true,
    order: 10,
  });
  console.log("✓ Created the single 'Shell Select' store.");

  // 4) Ensure editable singletons exist with singular copy.
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
  console.log("✓ Ensured Site Settings + Homepage singletons.");

  // 5) Fix seeded sample data wording to match a single store (ignore if deleted).
  await client
    .patch("promotion-sample-fathers-day")
    .set({ subtitle: "Available at Shell Select" })
    .commit()
    .catch(() => {});
  await client
    .patch("testimonial-sample-1")
    .set({ location: "Bought at Shell Select" })
    .commit()
    .catch(() => {});
  await client
    .patch("testimonial-sample-2")
    .set({
      location: "Bought at Shell Select",
      quote:
        "Picked up flowers at Shell Select on my way home. Wrapped beautifully and smelled incredible.",
    })
    .commit()
    .catch(() => {});
  console.log("✓ Updated sample promo + testimonials wording.");

  console.log("\n✓ Migration complete — the site now reflects one Shell Select store.");
}

main().catch((e) => {
  console.error("\n✗ Migration failed:", e);
  process.exit(1);
});
