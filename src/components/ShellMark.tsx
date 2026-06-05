import { cn } from "@/lib/utils";

/**
 * Subtle Gulbaan × Shell Select co-brand mark.
 * A pecten (scallop) glyph in Shell-ish tones + the "Shell Select" wordmark.
 * Replace with the official Shell Select logo via Site Settings → Shell Logo if desired.
 */
export function ShellScallop({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 44" aria-hidden="true" className={cn("h-5 w-5", className)}>
      <path
        d="M24 3c2.6 0 4.3 2 4.8 4.6.6 3 .2 6 .9 7.4.7 1.4 2.8 1 4.9 1.4 2.6.5 4.4 2.2 4.4 4.8 0 5.2-4 9.2-9 11.2-2.6 1-5.4 1.6-6 4.6h-8c-.6-3-3.4-3.6-6-4.6-5-2-9-6-9-11.2 0-2.6 1.8-4.3 4.4-4.8 2.1-.4 4.2 0 4.9-1.4.7-1.4.3-4.4.9-7.4C16.7 5 18.4 3 21 3"
        fill="#F7C948"
        stroke="#E8372C"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M24 9v26M16 12c1 6 1 14 0 20M32 12c-1 6-1 14 0 20" stroke="#E8372C" strokeWidth="1.4" fill="none" opacity="0.7" />
    </svg>
  );
}

export function ShellMark({
  className,
  label = "Shell Select",
  prefix = "Available at",
}: {
  className?: string;
  label?: string;
  prefix?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-bark/10 bg-white/70 px-3 py-1 text-xs font-medium text-bark/80",
        className,
      )}
    >
      <ShellScallop className="h-4 w-4" />
      {prefix && <span className="text-clay">{prefix}</span>}
      <span className="font-semibold">{label}</span>
    </span>
  );
}
