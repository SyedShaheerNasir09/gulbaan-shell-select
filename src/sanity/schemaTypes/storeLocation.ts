import { defineType, defineField } from "sanity";

export const storeLocation = defineType({
  name: "storeLocation",
  title: "Store Location",
  type: "document",
  description: "A Shell Select store where Gulbaan products are available.",
  fields: [
    defineField({
      name: "name",
      title: "Store Name",
      type: "string",
      description: 'e.g. "Shell Select DHA, Lahore"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      description: "Optional.",
      options: {
        list: [
          { title: "Lahore", value: "Lahore" },
          { title: "Islamabad", value: "Islamabad" },
          { title: "Karachi", value: "Karachi" },
          { title: "Rawalpindi", value: "Rawalpindi" },
        ],
      },
    }),
    defineField({ name: "area", title: "Area / Sector", type: "string" }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 2,
      description: "Full street address of the Shell Select store.",
    }),
    defineField({
      name: "mapUrl",
      title: "Google Maps URL",
      type: "url",
    }),
    defineField({
      name: "image",
      title: "Store Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      description: "Show this store on the website.",
      initialValue: true,
    }),
    defineField({ name: "order", title: "Display Order", type: "number", initialValue: 100 }),
  ],
  preview: {
    select: { title: "name", subtitle: "city", media: "image" },
  },
});
