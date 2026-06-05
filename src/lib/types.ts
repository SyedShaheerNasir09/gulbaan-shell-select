import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface CategoryRef {
  _id: string;
  title: string;
  slug: string;
}

export interface Category extends CategoryRef {
  description?: string;
  count?: number;
}

/** Lightweight shape used by product cards / grids. */
export interface ProductCardData {
  _id: string;
  name: string;
  slug: string;
  price?: number;
  currency?: string;
  shortDescription?: string;
  featured?: boolean;
  variant?: string;
  image?: SanityImageSource;
  category?: CategoryRef;
}

export type ProductStatus = "draft" | "approved" | "live";

export interface StoreLocationRef {
  _id: string;
  name: string;
  slug?: string;
  city?: string;
  area?: string;
  mapUrl?: string;
}

/** Full product detail. */
export interface Product {
  _id: string;
  name: string;
  slug: string;
  price?: number;
  currency?: string;
  shortDescription?: string;
  description?: string;
  productInfo?: string;
  featured?: boolean;
  status?: ProductStatus;
  variant?: string;
  deliveryCities?: string[];
  sourceUrl?: string;
  images?: SanityImageSource[];
  category?: CategoryRef;
}

export interface StoreLocation {
  _id: string;
  name: string;
  slug?: string;
  city?: string;
  area?: string;
  address?: string;
  mapUrl?: string;
  image?: SanityImageSource;
}

export interface Promotion {
  _id: string;
  title: string;
  subtitle?: string;
  image?: SanityImageSource;
  ctaText?: string;
  ctaLink?: string;
}

export interface Collection {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  image?: SanityImageSource;
  products?: ProductCardData[];
}

export interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  location?: string;
  rating?: number;
  image?: SanityImageSource;
}

export interface CorporatePage {
  enabled?: boolean;
  title?: string;
  intro?: string;
  services?: { title?: string; description?: string }[];
  image?: SanityImageSource;
  ctaText?: string;
  contactEmail?: string;
}

export interface Homepage {
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  primaryCard?: { title?: string; description?: string; buttonLabel?: string };
  secondaryCard?: {
    title?: string;
    description?: string;
    buttonLabel?: string;
    disabled?: boolean;
  };
  floristNote?: { message?: string; author?: string; signature?: string };
  seasonalTitle?: string;
  seasonalNote?: string;
  featuredTitle?: string;
  featuredSubtitle?: string;
}

export interface SiteSettings {
  title?: string;
  tagline?: string;
  logo?: SanityImageSource;
  footerNote?: string;
  contactEmail?: string;
  contactPhone?: string;
  instagram?: string;
  shellSelectNote?: string;
  availabilityMessage?: string;
  storeLocatorTitle?: string;
  shellLogo?: SanityImageSource;
}
