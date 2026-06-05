import { cn } from "@/lib/utils";

/**
 * Subtle "Shell Select" text label used as an availability/co-brand chip.
 */
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
      {prefix && <span className="text-clay">{prefix}</span>}
      <span className="font-semibold">{label}</span>
    </span>
  );
}
