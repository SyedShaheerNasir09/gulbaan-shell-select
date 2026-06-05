import { defineType, defineField } from "sanity";

/**
 * B2B / Corporate gifting page (singleton).
 * Hidden from the public site until `enabled` is turned on.
 */
export const corporate = defineType({
  name: "corporatePage",
  title: "Corporate / B2B",
  type: "document",
  fields: [
    defineField({
      name: "enabled",
      title: "Enabled (show on website)",
      type: "boolean",
      description: "Keep OFF until the corporate offering is ready to go public.",
      initialValue: false,
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Corporate & Event Gifting",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      initialValue:
        "Thoughtful floral gifting at scale — for corporate gifts, events and bulk orders.",
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "ctaText", title: "CTA Text", type: "string", initialValue: "Enquire now" }),
    defineField({ name: "contactEmail", title: "Contact Email", type: "string" }),
  ],
  preview: {
    select: { enabled: "enabled" },
    prepare({ enabled }) {
      return { title: "Corporate / B2B", subtitle: enabled ? "● Enabled (public)" : "○ Hidden" };
    },
  },
});
