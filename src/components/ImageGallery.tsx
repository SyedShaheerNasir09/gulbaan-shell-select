"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { imageSrc } from "@/sanity/image";
import { cn, EASE_PETAL } from "@/lib/utils";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export function ImageGallery({
  images,
  name,
}: {
  images: SanityImageSource[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="grid aspect-[4/5] place-items-center rounded-5xl bg-sand text-clay">
        No image available
      </div>
    );
  }

  const current = images[active];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-5xl border border-white/60 bg-sand shadow-soft">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_PETAL }}
            className="absolute inset-0"
          >
            <Image
              src={imageSrc(current, 1200)}
              alt={`${name} — view ${active + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl border-2 transition-all",
                i === active
                  ? "border-bloom shadow-petal"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={imageSrc(img, 240)}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
