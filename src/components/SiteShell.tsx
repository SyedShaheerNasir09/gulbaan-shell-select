import { sanityFetch } from "@/sanity/client";
import { siteSettingsQuery, corporatePageQuery } from "@/sanity/queries";
import type { SiteSettings, CorporatePage } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const FALLBACK_SETTINGS: SiteSettings = {
  title: "Gulbaan · Shell Select Store",
  shellSelectNote: "Available exclusively at Shell Select.",
  availabilityMessage: "Available at our Shell Select store.",
  storeLocatorTitle: "Visit us at Shell Select",
  footerNote:
    "Gulbaan is a visual catalogue. To bring an arrangement home, visit us at the Shell Select store.",
};

/** Server wrapper that provides the navbar + footer chrome to catalogue pages. */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [settings, corporate] = await Promise.all([
    sanityFetch<SiteSettings>({
      query: siteSettingsQuery,
      fallback: FALLBACK_SETTINGS,
      tags: ["siteSettings"],
    }),
    sanityFetch<CorporatePage>({
      query: corporatePageQuery,
      fallback: {},
      tags: ["corporatePage"],
    }),
  ]);

  const merged = { ...FALLBACK_SETTINGS, ...settings };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar settings={merged} corporateEnabled={Boolean(corporate?.enabled)} />
      <div className="flex-1">{children}</div>
      <Footer settings={merged} />
    </div>
  );
}
