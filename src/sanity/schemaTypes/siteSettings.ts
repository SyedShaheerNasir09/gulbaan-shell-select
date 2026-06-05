import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      initialValue: "Gulbaan · Shell Select Store",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      initialValue: "A premium digital flower catalogue.",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "shellSelectNote",
      title: "Shell Select Note",
      type: "string",
      description: "Small line shown in the header/footer about the partnership.",
      initialValue: "Available exclusively at Shell Select.",
    }),
    defineField({
      name: "availabilityMessage",
      title: "Availability Message",
      type: "string",
      description: "Where these products can be found (shown on landing & product pages).",
      initialValue: "Available at our Shell Select store.",
    }),
    defineField({
      name: "storeLocatorTitle",
      title: "Store Locator Title",
      type: "string",
      initialValue: "Visit us at Shell Select",
    }),
    defineField({
      name: "shellLogo",
      title: "Shell Select Logo (co-brand)",
      type: "image",
      description: "Optional Shell Select mark shown beside the Gulbaan logo.",
    }),
    defineField({
      name: "footerNote",
      title: "Footer Note",
      type: "text",
      rows: 2,
      initialValue:
        "Gulbaan is a visual catalogue. To bring an arrangement home, visit us at the Shell Select store.",
    }),
    defineField({ name: "contactEmail", title: "Contact Email", type: "string" }),
    defineField({ name: "contactPhone", title: "Contact Phone", type: "string" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
