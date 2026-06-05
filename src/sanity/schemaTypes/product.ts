import { defineType, defineField } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "pricing", title: "Pricing" },
    { name: "media", title: "Images" },
    { name: "visibility", title: "Visibility" },
    { name: "meta", title: "Extra info" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug (web address)",
      type: "slug",
      group: "content",
      description: "Auto-generated from the name. Used in the page URL.",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "content",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 2,
      group: "content",
      description: "One line shown on product cards (keep it under ~160 chars).",
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: "description",
      title: "Full Description",
      type: "text",
      rows: 10,
      group: "content",
      description: "Full product story. Line breaks are preserved on the website.",
    }),
    // Pricing
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      group: "pricing",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      group: "pricing",
      initialValue: "PKR",
      options: {
        list: [
          { title: "PKR (Rs)", value: "PKR" },
          { title: "USD ($)", value: "USD" },
        ],
        layout: "radio",
      },
    }),
    // Media
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      group: "media",
      options: { layout: "grid" },
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Describe the image for accessibility & SEO.",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).warning("Add at least one image."),
    }),
    // Visibility
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      group: "visibility",
      description: "Highlight this product at the top of the catalogue.",
      initialValue: false,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "visibility",
      description:
        "Approval workflow. Only products set to LIVE appear on the website. " +
        "Draft → Approved for Shell → Live prevents accidental publishing of unfinished products.",
      options: {
        list: [
          { title: "📝 Draft", value: "draft" },
          { title: "✅ Approved for Shell", value: "approved" },
          { title: "🌿 Live", value: "live" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    // Extra info
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      group: "meta",
      description: "e.g. 'Pink Spray Roses' (optional).",
    }),
    defineField({
      name: "productInfo",
      title: "Product Information",
      type: "text",
      rows: 5,
      group: "meta",
      description: "Care notes, delivery info, materials, etc.",
    }),
    defineField({
      name: "deliveryCities",
      title: "Delivery Cities",
      type: "array",
      group: "meta",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "sourceUrl",
      title: "Original Source URL",
      type: "url",
      group: "meta",
      description: "Reference link to the original gulbaan.com page (internal).",
    }),
    defineField({
      name: "originalTitle",
      title: "Original Catalogue Title",
      type: "string",
      group: "meta",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.title",
      media: "images.0",
      status: "status",
    },
    prepare({ title, subtitle, media, status }) {
      const label =
        status === "live"
          ? "🌿 Live"
          : status === "approved"
            ? "✅ Approved for Shell"
            : "📝 Draft";
      return {
        title,
        subtitle: `${subtitle || "Uncategorised"}  —  ${label}`,
        media,
      };
    },
  },
});
