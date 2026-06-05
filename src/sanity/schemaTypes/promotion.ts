import { defineType, defineField } from "sanity";

export const promotion = defineType({
  name: "promotion",
  title: "Promotion",
  type: "document",
  description: "Time-bound Shell Select campaign banners (e.g. seasonal collections).",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: 'e.g. "Available at Shell Select"',
    }),
    defineField({
      name: "image",
      title: "Banner Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "startDate", title: "Start Date", type: "datetime" }),
    defineField({ name: "endDate", title: "End Date", type: "datetime" }),
    defineField({ name: "ctaText", title: "Button Text", type: "string" }),
    defineField({
      name: "ctaLink",
      title: "Button Link",
      type: "string",
      description: "Where the button goes, e.g. /store or /category/bouquets",
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      description: "Master on/off switch (also respects the start/end dates).",
      initialValue: true,
    }),
    defineField({ name: "order", title: "Display Order", type: "number", initialValue: 100 }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "image", start: "startDate", end: "endDate" },
    prepare({ title, subtitle, media, start, end }) {
      const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString() : "—");
      return {
        title,
        subtitle: subtitle ? `${subtitle} · ${fmt(start)}→${fmt(end)}` : `${fmt(start)} → ${fmt(end)}`,
        media,
      };
    },
  },
});
