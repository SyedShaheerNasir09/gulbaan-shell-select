import { cn } from "@/lib/utils";

/**
 * Lightweight inline-SVG florals used as ambient decoration.
 * All are decorative (aria-hidden) and inherit currentColor for stems/petals.
 */

export function Sprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={cn("h-24 w-24", className)}
      fill="none"
    >
      <path
        d="M60 112V40"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M60 78c-14 2-24-6-27-20 14-2 24 6 27 20ZM60 78c14 2 24-6 27-20-14-2-24 6-27 20Z"
        fill="currentColor"
        opacity="0.35"
      />
      <g fill="currentColor">
        <circle cx="60" cy="30" r="10" opacity="0.9" />
        <circle cx="48" cy="38" r="8" opacity="0.7" />
        <circle cx="72" cy="38" r="8" opacity="0.7" />
        <circle cx="54" cy="22" r="7" opacity="0.8" />
        <circle cx="66" cy="22" r="7" opacity="0.8" />
        <circle cx="60" cy="34" r="4" fill="#FFFDF9" opacity="0.85" />
      </g>
    </svg>
  );
}

export function LeafBranch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      aria-hidden="true"
      className={cn("h-28 w-44", className)}
      fill="none"
    >
      <path
        d="M8 110C60 96 130 70 192 16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {[30, 64, 98, 132, 166].map((x, i) => (
        <path
          key={i}
          d={`M${x} ${96 - i * 16}c10-14 26-16 40-8-8 16-26 20-40 8Z`}
          fill="currentColor"
          opacity={0.3 + i * 0.08}
        />
      ))}
    </svg>
  );
}

export function PetalScatter({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      aria-hidden="true"
      className={cn("h-40 w-40", className)}
      fill="none"
    >
      <g fill="currentColor">
        <ellipse cx="60" cy="50" rx="16" ry="9" transform="rotate(-25 60 50)" opacity="0.5" />
        <ellipse cx="170" cy="80" rx="18" ry="10" transform="rotate(20 170 80)" opacity="0.4" />
        <ellipse cx="110" cy="150" rx="20" ry="11" transform="rotate(-10 110 150)" opacity="0.45" />
        <ellipse cx="200" cy="180" rx="14" ry="8" transform="rotate(35 200 180)" opacity="0.35" />
        <ellipse cx="40" cy="190" rx="15" ry="9" transform="rotate(15 40 190)" opacity="0.4" />
      </g>
    </svg>
  );
}

/** A soft, organic blob used behind imagery. */
export function BlobBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "blob-mask bg-petal-gradient opacity-70 blur-[2px]",
        className,
      )}
    />
  );
}
