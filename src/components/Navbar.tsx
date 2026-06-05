import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { ShellScallop } from "@/components/ShellMark";

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
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-bloom/10 text-bloom transition-colors group-hover:bg-bloom/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="5" r="2.4" opacity="0.8" />
              <circle cx="12" cy="19" r="2.4" opacity="0.8" />
              <circle cx="5" cy="12" r="2.4" opacity="0.8" />
              <circle cx="19" cy="12" r="2.4" opacity="0.8" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="flex items-center gap-1.5">
              <span className="display text-xl text-bark">Gulbaan</span>
              <span className="text-clay">×</span>
              <ShellScallop className="h-4 w-4" />
            </span>
            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-clay">
              Shell Select Store
            </span>
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
