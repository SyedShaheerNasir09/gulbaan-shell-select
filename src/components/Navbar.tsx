import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { GulbaanLogo } from "@/components/GulbaanLogo";

export function Navbar({
  settings,
  corporateEnabled = false,
}: {
  settings: SiteSettings;
  corporateEnabled?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-bark/5 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 sm:py-4">
        <Link href="/" className="group flex items-center gap-3" aria-label="Gulbaan — Shell Select Store">
          <GulbaanLogo className="h-8 transition-transform duration-300 group-hover:scale-[1.03] sm:h-9" />
          <span className="hidden h-7 w-px bg-bark/15 sm:block" />
          <span className="hidden text-[0.62rem] font-medium uppercase tracking-[0.22em] text-clay sm:block">
            Shell Select Store
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/store"
            className="rounded-full px-3 py-2 text-sm font-medium text-bark/80 transition-colors hover:bg-white/60 hover:text-bloom sm:px-4"
          >
            Catalogue
          </Link>
          <Link
            href="/stores"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-bark/80 transition-colors hover:bg-white/60 hover:text-bloom sm:block sm:px-4"
          >
            Visit
          </Link>
          {corporateEnabled && (
            <Link
              href="/corporate"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-bark/80 transition-colors hover:bg-white/60 hover:text-bloom md:block"
            >
              Corporate
            </Link>
          )}
          <Link href="/store" className="btn-primary px-4 py-2 text-sm sm:px-5">
            Explore
          </Link>
        </nav>
      </div>
    </header>
  );
}
