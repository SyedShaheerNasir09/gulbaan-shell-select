/**
 * Embedded Sanity Studio, served at /studio.
 * The Gulbaan sales team logs in here to edit products, prices, images,
 * drafts and publishing — no developer required.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
