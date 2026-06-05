import type { StructureResolver } from "sanity/structure";

/**
 * Custom Studio desk:
 * - Singletons (Homepage, Site Settings, Corporate/B2B) are single documents.
 * - Everything else is a normal list.
 */
export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Gulbaan · Shell Select")
    .items([
      // Catalogue
      S.documentTypeListItem("product").title("Products"),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("collection").title("Collections"),
      S.divider(),
      // Shell Select
      S.documentTypeListItem("promotion").title("Promotions"),
      S.documentTypeListItem("storeLocation").title("Store Locations"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.divider(),
      // Singletons
      S.listItem()
        .title("Homepage")
        .id("homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Corporate / B2B  (hidden)")
        .id("corporatePage")
        .child(S.document().schemaType("corporatePage").documentId("corporatePage")),
    ]);
