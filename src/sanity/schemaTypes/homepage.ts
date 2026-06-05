import { defineType, defineField } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Landing", default: true },
    { name: "cards", title: "Entry Cards" },
    { name: "human", title: "Human Touch" },
  ],
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Eyebrow text",
      type: "string",
      group: "hero",
      initialValue: "Gulbaan · in bloom at Shell Select",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      group: "hero",
      initialValue: "A garden of gifts, gathered for you",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      group: "hero",
      initialValue:
        "Discover Gulbaan's handcrafted floral collection, now available at Shell Select.",
    }),
    // Entry cards
    defineField({
      name: "primaryCard",
      title: "Primary Card — Shell Select Store",
      type: "object",
      group: "cards",
      fields: [
        defineField({ name: "title", type: "string", initialValue: "Shell Select Store" }),
        defineField({
          name: "description",
          type: "text",
          rows: 2,
          initialValue: "Explore the Gulbaan collection available at Shell Select.",
        }),
        defineField({ name: "buttonLabel", type: "string", initialValue: "Enter Store" }),
      ],
    }),
    defineField({
      name: "secondaryCard",
      title: "Secondary Card — Coming Soon",
      type: "object",
      group: "cards",
      fields: [
        defineField({ name: "title", type: "string", initialValue: "Coming Soon" }),
        defineField({
          name: "description",
          type: "text",
          rows: 2,
          initialValue: "A new experience is blooming.",
        }),
        defineField({ name: "buttonLabel", type: "string", initialValue: "Coming Soon" }),
        defineField({
          name: "disabled",
          title: "Disabled",
          type: "boolean",
          initialValue: true,
        }),
      ],
    }),
    // Human touch
    defineField({
      name: "featuredTitle",
      title: "Featured Section Title",
      type: "string",
      group: "human",
      initialValue: "Florist's favourites",
    }),
    defineField({
      name: "featuredSubtitle",
      title: "Featured Section Subtitle",
      type: "string",
      group: "human",
      initialValue: "A few blooms we're especially proud of this season.",
    }),
    defineField({
      name: "floristNote",
      title: "Note from the Florist",
      type: "object",
      group: "human",
      fields: [
        defineField({
          name: "message",
          type: "text",
          rows: 3,
          initialValue:
            "Every arrangement is tied by hand, the morning it's made. We hope it brings a little spring into your day.",
        }),
        defineField({ name: "author", type: "string", initialValue: "The Gulbaan Florists" }),
        defineField({ name: "signature", type: "string", initialValue: "With love, Gulbaan" }),
      ],
    }),
    defineField({
      name: "seasonalTitle",
      title: "Seasonal Recommendation Title",
      type: "string",
      group: "human",
      initialValue: "In season now",
    }),
    defineField({
      name: "seasonalNote",
      title: "Seasonal Recommendation Note",
      type: "text",
      rows: 2,
      group: "human",
      initialValue: "Soft pastels, garden roses and the first blush of summer.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
