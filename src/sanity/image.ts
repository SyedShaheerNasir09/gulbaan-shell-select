import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "./env";

const builder = imageUrlBuilder({
  projectId: projectId || "placeholder",
  dataset,
});

/**
 * Returns a Sanity image URL builder.
 * `.auto("format")` makes Sanity serve modern formats (and convert HEIC -> jpg/webp)
 * automatically based on the browser.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}

/** Convenience: a ready-to-use src string at a given width. */
export function imageSrc(source: SanityImageSource, width = 1200): string {
  if (!source) return "";
  return urlFor(source).width(width).quality(82).url();
}
