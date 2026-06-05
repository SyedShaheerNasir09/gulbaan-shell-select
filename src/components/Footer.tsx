import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { Sprig } from "@/components/FloralDecor";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-bark/10 bg-linen/60">
      <div className="pointer-events-none absolute -left-6 -top-10 text-sage/30">
        <Sprig className="h-32 w-32" />
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="display text-2xl text-bark">Gulbaan × Shell Select</p>
          <p className="mt-3 max-w-md text-pretty text-sm text-bark/65">
            {settings.footerNote ||
              "Gulbaan is a visual catalogue. To purchase, please visit a participating Shell Select store."}
          </p>
          {settings.availabilityMessage && (
            <p className="mt-3 text-sm font-medium text-bark/75">
              {settings.availabilityMessage}
            </p>
          )}
          <p className="handwritten mt-4 text-xl">
            {settings.shellSelectNote || "Available exclusively at Shell Select."}
          </p>
        </div>

        <div>
          <h3 className="eyebrow">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-bark/70">
            <li>
              <Link href="/store" className="hover:text-bloom">Catalogue</Link>
            </li>
            <li>
              <Link href="/stores" className="hover:text-bloom">Visit us</Link>
            </li>
            <li>
              <Link href="/" className="hover:text-bloom">Home</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Say hello</h3>
          <ul className="mt-4 space-y-2 text-sm text-bark/70">
            {settings.contactEmail && (
              <li>
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-bloom">
                  {settings.contactEmail}
                </a>
              </li>
            )}
            {settings.contactPhone && (
              <li>
                <a href={`tel:${settings.contactPhone}`} className="hover:text-bloom">
                  {settings.contactPhone}
                </a>
              </li>
            )}
            {settings.instagram && (
              <li>
                <a href={settings.instagram} target="_blank" rel="noreferrer" className="hover:text-bloom">
                  Instagram
                </a>
              </li>
            )}
            {!settings.contactEmail && !settings.contactPhone && (
              <li className="text-clay">Visit a Shell Select store near you.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-bark/10 px-5 py-6 text-center text-xs text-clay sm:px-8">
        © {new Date().getFullYear()} Gulbaan · Shell Select Store · A digital catalogue, not an online shop.
      </div>
    </footer>
  );
}
