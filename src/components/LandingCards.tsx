"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sprig } from "@/components/FloralDecor";
import { EASE_PETAL } from "@/lib/utils";

interface CardContent {
  title: string;
  description: string;
  buttonLabel: string;
}

interface LandingCardsProps {
  primary: CardContent;
  secondary: CardContent & { disabled?: boolean };
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_PETAL },
  },
};

export function LandingCards({ primary, secondary }: LandingCardsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2"
    >
      {/* Primary — Shell Select Store */}
      <motion.div variants={item}>
        <Link
          href="/store"
          aria-label={`${primary.title} — ${primary.buttonLabel}`}
          className="group relative flex h-full flex-col overflow-hidden rounded-5xl border border-white/70 bg-ivory/85 p-8 shadow-soft backdrop-blur-sm transition-all duration-500 ease-petal hover:-translate-y-1.5 hover:shadow-petal sm:p-10"
        >
          <div className="absolute -right-6 -top-6 text-blush/60 transition-transform duration-700 ease-petal group-hover:rotate-12 group-hover:scale-110">
            <Sprig className="h-28 w-28" />
          </div>
          <span className="eyebrow">Now open</span>
          <h2 className="display mt-3 text-3xl sm:text-4xl">{primary.title}</h2>
          <p className="mt-4 max-w-xs text-pretty text-bark/70">
            {primary.description}
          </p>
          <div className="mt-auto pt-8">
            <span className="btn-primary group-hover:bg-rose">
              {primary.buttonLabel}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </Link>
      </motion.div>

      {/* Secondary — Coming Soon (disabled) */}
      <motion.div variants={item}>
        <div
          aria-disabled="true"
          className="relative flex h-full cursor-not-allowed select-none flex-col overflow-hidden rounded-5xl border border-bark/10 bg-sand/50 p-8 opacity-80 sm:p-10"
        >
          <div className="absolute -right-6 -top-6 text-sage/40">
            <Sprig className="h-28 w-28" />
          </div>
          <span className="eyebrow text-clay/70">A new chapter</span>
          <h2 className="display mt-3 text-3xl text-bark/55 sm:text-4xl">
            {secondary.title}
          </h2>
          <p className="mt-4 max-w-xs text-pretty text-bark/50">
            {secondary.description}
          </p>
          <p className="handwritten mt-3 text-xl text-bloom/50">
            blooming soon…
          </p>
          <div className="mt-auto pt-8">
            <span className="inline-flex items-center justify-center gap-2 rounded-full border border-bark/15 bg-white/40 px-7 py-3 text-sm font-medium tracking-wide text-bark/40">
              {secondary.buttonLabel}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
