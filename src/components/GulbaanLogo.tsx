import { cn } from "@/lib/utils";

/**
 * Gulbaan's official wordmark logo (vector SVG in /public).
 * Size it by setting a height utility, e.g. <GulbaanLogo className="h-9" />.
 */
export function GulbaanLogo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/gulbaan-logo.svg"
      alt="Gulbaan"
      width={160}
      height={72}
      className={cn("w-auto select-none", className)}
    />
  );
}
