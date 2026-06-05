"use client";

/**
 * Sanity Studio configuration.
 * This config powers the embedded Studio at /studio so the Gulbaan sales team
 * can edit products, prices, images and drafts without a developer.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { projectId, dataset, apiVersion } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { deskStructure } from "@/sanity/structure";

export default defineConfig({
  name: "gulbaan-shell-select",
  title: "Gulbaan · Shell Select Store",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
