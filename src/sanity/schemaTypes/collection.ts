import { defineType, defineField } from "sanity";

export const collection = defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  description: "A curated, editorial grouping of products (distinct from category).",
  fields: [
    defineField({
      name: "title",
      title: "Collection Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({ name: "order", title: "Display Order", type: "number", initialValue: 100 }),
  ],
  preview: {
    select: { title: "title", subtitle: "description", media: "image" },
  },
});
