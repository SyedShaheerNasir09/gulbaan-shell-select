import { type SchemaTypeDefinition } from "sanity";

import { product } from "./product";
import { category } from "./category";
import { collection } from "./collection";
import { promotion } from "./promotion";
import { storeLocation } from "./storeLocation";
import { testimonial } from "./testimonial";
import { homepage } from "./homepage";
import { siteSettings } from "./siteSettings";
import { corporate } from "./corporate";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Catalogue
  product,
  category,
  collection,
  // Shell Select
  promotion,
  storeLocation,
  testimonial,
  // Singletons
  homepage,
  siteSettings,
  corporate,
];
