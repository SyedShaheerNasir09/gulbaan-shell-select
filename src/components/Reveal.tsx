"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_PETAL } from "@/lib/utils";

/** Gentle fade-up on scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: EASE_PETAL, delay }}
    >
      {children}
    </motion.div>
  );
}
