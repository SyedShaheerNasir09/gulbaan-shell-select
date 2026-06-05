import { groq } from "next-sanity";

/** A product is publicly visible only when status == "live". */
const LIVE = `status == "live"`;

const PRODUCT_FIELDS = groq`
  _id,
  name,
  "slug": slug.current,
  price,
  currency,
  shortDescription,
  description,
  productInfo,
  featured,
  variant,
  deliveryCities,
  sourceUrl,
  images,
  "category": category->{ _id, title, "slug": slug.current }
`;

const CARD_FIELDS = groq`
  _id,
  name,
  "slug": slug.current,
  price,
  currency,
  shortDescription,
  featured,
  variant,
  "image": images[0],
  "category": category->{ _id, title, "slug": slug.current }
`;

/* ----------------------------- Products ----------------------------- */

export const allProductsQuery = groq`
  *[_type == "product" && ${LIVE}]
  | order(featured desc, name asc){ ${CARD_FIELDS} }
`;

export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true && ${LIVE}]
  | order(name asc)[0...8]{ ${CARD_FIELDS} }
`;

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug && status != "draft"][0]{ ${PRODUCT_FIELDS} }
`;

export const relatedProductsQuery = groq`
  *[_type == "product" && ${LIVE}
    && slug.current != $slug
    && category._ref == $categoryId]
  | order(featured desc, name asc)[0...4]{ ${CARD_FIELDS} }
`;

export const allProductSlugsQuery = groq`
  *[_type == "product" && ${LIVE}].slug.current
`;

/* ---------------------------- Categories ---------------------------- */

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(order asc, title asc){
    _id,
    title,
    "slug": slug.current,
    description,
    "count": count(*[_type == "product" && references(^._id) && ${LIVE}])
  }
`;

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, description
  }
`;

export const productsByCategoryQuery = groq`
  *[_type == "product" && ${LIVE} && category->slug.current == $slug]
  | order(featured desc, name asc){ ${CARD_FIELDS} }
`;

export const allCategorySlugsQuery = groq`*[_type == "category"].slug.current`;

/* ---------------------------- Collections --------------------------- */

export const activeCollectionsQuery = groq`
  *[_type == "collection" && active == true && count(products) > 0]
  | order(order asc, title asc){
    _id, title, "slug": slug.current, description, image,
    "products": products[@->status == "live"]->{ ${CARD_FIELDS} }
  }
`;

/* ---------------------------- Promotions ---------------------------- */

export const activePromotionsQuery = groq`
  *[_type == "promotion" && active == true
    && (!defined(startDate) || startDate <= now())
    && (!defined(endDate) || endDate >= now())]
  | order(order asc, _createdAt desc){
    _id, title, subtitle, image, ctaText, ctaLink
  }
`;

/* -------------------------- Store Locations ------------------------- */

export const allStoreLocationsQuery = groq`
  *[_type == "storeLocation" && active == true]
  | order(city asc, order asc, name asc){
    _id, name, "slug": slug.current, city, area, address, mapUrl, image
  }
`;

/* --------------------------- Testimonials --------------------------- */

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(featured desc, order asc)[0...6]{
    _id, quote, author, location, rating, image
  }
`;

/* ----------------------------- Singletons --------------------------- */

export const homepageQuery = groq`
  *[_type == "homepage"][0]{
    heroEyebrow, heroTitle, heroSubtitle,
    primaryCard, secondaryCard,
    floristNote, seasonalTitle, seasonalNote,
    featuredTitle, featuredSubtitle
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    title, tagline, logo, footerNote,
    contactEmail, contactPhone, instagram,
    shellSelectNote, availabilityMessage, storeLocatorTitle, shellLogo
  }
`;

export const corporatePageQuery = groq`
  *[_type == "corporatePage"][0]{
    enabled, title, intro, services, image, ctaText, contactEmail
  }
`;
